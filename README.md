🚀 Prerequisites

Ensure the following tools are installed on your system:

Node.js (v18.x or higher recommended)

npm or yarn

Git

📂 Project Structure

/project-root

├── backend/      # Node.js Backend

│   ├── data/

│   ├── package.json

│   └── index.js

│

└── frontend/     # Next.js Frontend

    ├── src/
    
    ├── package.json
    
    └── .env.local
    
    
🛠️ 1. Backend Setup

➡️ Navigate to Backend Directory

cd backend

➡️ Install Dependencies

npm install

# or if using yarn

yarn install

➡️ Configure Environment Variables

Create a .env file in the backend folder and add:

➡️ Start the Backend Server

node index.js

The backend server will run at: http://localhost:8081

💻 2. Frontend Setup

➡️ Navigate to Frontend Directory
cd ../frontend

➡️ Install Dependencies
npm install
# or
yarn install
➡️ Configure Environment Variables
Create a .env.local file in the frontend folder and add:
NEXT_PUBLIC_API_URL=http://localhost:3000

➡️ Start the Frontend Server
# For development mode:

npm run dev
# or
yarn dev

# For production build:

npm run build

npm start
# or
yarn build
yarn start
By default, the frontend server will run at: http://localhost:3000

🔗 3. Connect Frontend and Backend
Restart both backend and frontend servers if you made changes.

✅ 4. Verify Everything is Working
Backend API Test: Visit http://localhost:8081.
Frontend App Test: Visit http://localhost:3000 in your browser.
Ensure the frontend is able to fetch data from the backend.

📚 Available Scripts
Backend
node index.js → Start backend.
Frontend
npm run dev → Start frontend in development mode.
npm run build → Build the frontend for production.
npm start → Start the frontend in production mode.

🐞 5. Troubleshooting
🔹 Port Conflicts
Ensure ports 8081 (backend) and 3000 (frontend) are not already in use.

🔹 Environment Variables Not Loading
Check .env (backend) and .env.local (frontend) files for correctness.

🔹 Dependency Issues
Remove node_modules and reinstall dependencies:

rm -rf node_modules
npm install

🤝 6. Contribution
Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

📄 7. License
This project is licensed under the MIT License.
