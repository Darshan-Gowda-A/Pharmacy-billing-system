// server/src/routes/sales.js
const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');
const auth = require('../middleware/auth');

// create sale (billing)
router.post('/', auth, async (req, res) => {
  try {
    /* req.body:
       {
         items: [{ medicine: id, qty, price, gstPercent }],
         discount: number,
         customer: customerId (optional)
       }
    */
    const { items, discount = 0, customer } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'No items' });
    }

    // compute totals and update stock
    let total = 0;
    let tax = 0;
    const populatedItems = [];

    for (const it of items) {
      // validate item shape
      if (!it.medicine || !it.qty || !it.price) {
        return res.status(400).json({ msg: 'Invalid item format' });
      }

      const med = await Medicine.findById(it.medicine);
      if (!med) return res.status(400).json({ msg: `Medicine ${it.medicine} not found` });
      if (med.quantity < it.qty) return res.status(400).json({ msg: `Insufficient stock for ${med.name}` });

      const subtotal = Number((it.qty * it.price).toFixed(2));
      const gstPercent = Number(it.gstPercent ?? med.gstPercent ?? 0);
      const itemTax = Number(((gstPercent / 100) * subtotal).toFixed(2));

      total += subtotal;
      tax += itemTax;

      // update stock
      med.quantity -= it.qty;
      await med.save();

      populatedItems.push({
        medicine: med._id,
        name: med.name,
        qty: it.qty,
        price: it.price,
        gstPercent,
        subtotal
      });
    }

    total = Number(total.toFixed(2));
    tax = Number(tax.toFixed(2));
    const grandTotal = Number((total + tax - (Number(discount) || 0)).toFixed(2));

    // use "user" field (matches Sale model)
    const userId = req.user?.id || req.user?._id || null;

    const sale = new Sale({
      items: populatedItems,
      total,
      tax,
      discount: Number(discount) || 0,
      grandTotal,
      customer,
      user: userId
    });

    await sale.save();

    // return 201 created and the sale
    return res.status(201).json(sale);
  } catch (err) {
    console.error('POST /api/sales error', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// list sales
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find().populate('customer').populate('user').sort({ createdAt: -1 });
    return res.json(sales);
  } catch (err) {
    console.error('GET /api/sales error', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// get invoice by id
router.get('/:id', auth, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('customer').populate('user');
    if (!sale) return res.status(404).json({ msg: 'Not found' });
    return res.json(sale);
  } catch (err) {
    console.error('GET /api/sales/:id error', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
