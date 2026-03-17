require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/11towers';

async function check() {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await User.find();
    console.log('Users found:', users.map(u => ({ name: u.name, email: u.email, role: u.role })));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
