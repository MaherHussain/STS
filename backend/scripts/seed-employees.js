import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import dbConnection from '../src/config/db.js';
import User from '../src/models/user.model.js';

dotenv.config();

const seedEmployees = async () => {
  try {
    await dbConnection();
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ role: 'ADMIN' });
    if (!admin) {
      console.error('No admin user found. Please create an admin first.');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
    const employees = [];

    for (let i = 1; i <= 15; i++) {
        const email = `test.employee${i}@example.com`;
        const exists = await User.findOne({ email });
        if (exists) continue;

      employees.push({
        name: `Test Employee ${i}`,
        email: email,
        hashedPassword,
        role: 'EMPLOYEE',
        isActive: true,
        createdBy: admin._id,
      });
    }

    if (employees.length > 0) {
        await User.insertMany(employees);
        console.log(`Successfully added ${employees.length} employees.`);
    } else {
        console.log('All test employees already exist.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding employees:', error);
    process.exit(1);
  }
};

seedEmployees();
