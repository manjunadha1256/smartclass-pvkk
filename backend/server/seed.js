const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await User.deleteMany({ email: 'admin@test.com' });
        const hashed = await bcrypt.hash('password123', 10);
        await User.create({
            name: 'System Admin',
            email: 'admin@test.com',
            password: hashed,
            role: 'admin'
        });
        console.log('✅ Admin account created: admin@test.com / password123');
        process.exit();
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}
