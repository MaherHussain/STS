#🛠 Bootstrap Admin Script:

This project uses a bootstrap script to create the initial ADMIN user.
The script is not exposed as an API and must be run manually from the command line.

📌 Purpose:

The bootstrap script is used to:

Create the first admin user

Securely hash the password

Avoid public signup or insecure admin creation

Run safely multiple times (idempotent)

📁 Script Location:
backend/scripts/createAdmin.js

⚙️ Prerequisites

Before running the script, ensure:

MongoDB connection string is set in backend/.env

Dependencies are installed (npm install)

Database is reachable

▶️ How to Run the Script: from any directory in the project 
node backend/scripts/createAdmin.js <email> <password>

Example: node backend/scripts/createAdmin.js admin@company.com StrongPassword123!

✅ Expected Behavior:

If no active admin exists → a new admin user is created

If an active admin already exists → script exits safely

Password is stored hashed

Script terminates automatically after execution

⚠️ Important: 

This script should only be used by:

The system owner

DevOps

Authorized backend developers

Do not expose this functionality as an API.