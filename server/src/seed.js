// server/src/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// CORRECT relative requires (seed.js is inside server/src)
const User = require('./models/User');
const Medicine = require('./models/Medicine');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  // admin
  const email = 'admin@pharmacy.com';
  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    const admin = new User({ name: 'Admin', email, passwordHash, role: 'admin' });
    await admin.save();
    console.log('Admin created: admin@pharmacy.com / admin123');
  } else {
    console.log('Admin exists');
  }

  // sample meds
  const sample = [
    { name: 'Paracetamol', manufacturer: 'Pharma A', price: 10, mrp: 12, quantity: 50, gstPercent: 5 },
    { name: 'Amoxicillin 500mg', manufacturer: 'Pharma B', price: 45, mrp: 50, quantity: 40, gstPercent: 12 },
    { name: 'Cough Syrup', manufacturer: 'Pharma C', price: 75, mrp: 85, quantity: 30, gstPercent: 18 }
  ];
  for (const s of sample) {
    const exists = await Medicine.findOne({ name: s.name });
    if (!exists) {
      const m = new Medicine(s);
      await m.save();
      console.log('Inserted medicine:', s.name);
    }
  }

  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
