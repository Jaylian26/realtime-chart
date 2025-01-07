import { WebSocketServer } from "ws";
import axios from "axios";
import fs from "fs/promises";
import path from "path";

// Initialize WebSocket server on port 8081
const wss = new WebSocketServer({ port: 8081 });

// Configure data storage
const DATA_DIR = "./data";
const DATA_FILE = path.join(DATA_DIR, "klines_history_data.json");
const MAX_HISTORY = 1000;

// Store historical data in memory
let historicalData = [];

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Function to save data to file
async function saveToFile(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data), "utf8");
}

// Function to load data from file
async function loadFromFile() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Function to transform klines data into candlestick format
function transformKlinesData(data) {
  return {
    time: parseInt(data.klineOpenTime),
    open: parseFloat(data.openPrice),
    high: parseFloat(data.highPrice),
    low: parseFloat(data.lowPrice),
    close: parseFloat(data.closePrice),
    volume: parseFloat(data.volume),
  };
}

// Function to fetch klines data
async function fetchKlinesData() {
  try {
    const response = await axios.get(
      "https://testnet.mgfi.pro/gateway/deepbook/klines?symbol=DEEP_SUI"
    );

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid klines data format");
    }

    // Transform each kline into candlestick format
    const candlestickData = response.data.map(transformKlinesData);
    if (candlestickData.length <= historicalData.length) {
      saveToFile([]);
    }
    // Return the latest candlestick
    return candlestickData;
  } catch (error) {
    console.error("Error fetching klines data:", error.message);
    return null;
  }
}

// Initialize data fetching
let fetchInterval;
const startDataFetching = async () => {
  if (fetchInterval) return;
  const data = await fetchKlinesData();

  fetchInterval = setInterval(async () => {
    const currentIndex = historicalData.length;
    historicalData.push(data[currentIndex]);

    if (data && data.length > 0 && currentIndex < data.length) {
      await saveToFile(historicalData);
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        client.send(
          JSON.stringify({ type: "update", data: data[currentIndex] })
        );
      });
      return;
    } else if (currentIndex >= data.length) {
      await saveToFile([]);
      historicalData = [];

      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: "initial", data: historicalData }));
      });
    }
  }, 2000);
};

// Handle client connections
wss.on("connection", async (ws) => {
  console.log("Client connected");

  // Start data fetching if not already started
  startDataFetching();

  // Send initial historical data
  ws.send(JSON.stringify({ type: "initial", data: historicalData }));

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    // Stop data fetching if no clients are connected
    if (wss.clients.size === 0) {
      clearInterval(fetchInterval);
      fetchInterval = null;
    }
  });
});

// Initialize the application
async function initialize() {
  try {
    // Ensure data directory exists
    await ensureDataDir();

    // Load historical data from file
    historicalData = await loadFromFile();
    console.log(`Loaded ${historicalData.length} historical records from file`);

    // Fetch initial data
    await fetchKlinesData();
    console.log("Initial data fetched");
    console.log("WebSocket server running on ws://localhost:8081");
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1);
  }
}

// Start the application
initialize();

// Handle application shutdown
process.on("SIGINT", async () => {
  clearInterval(fetchInterval);
  // Save data before shutting down
  if (historicalData.length > 0) {
    await saveToFile(historicalData);
  }
  process.exit(0);
});
