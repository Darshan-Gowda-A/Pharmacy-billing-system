import React, { useState } from "react";

export default function MedicineForm({ initialData = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    manufacturer: initialData.manufacturer || '',
    batch: initialData.batch || '',
    expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().slice(0,10) : '',
    price: initialData.price || 0,
    mrp: initialData.mrp || 0,
    quantity: initialData.quantity || 0,
    gstPercent: initialData.gstPercent || 0
  });

  function change(e){
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function submit(e){
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp),
      quantity: Number(form.quantity),
      gstPercent: Number(form.gstPercent),
      expiryDate: form.expiryDate ? new Date(form.expiryDate) : undefined
    });
  }

  return (
    <form onSubmit={submit} style={{display:'grid',gap:8}}>
      <input name="name" value={form.name} onChange={change} placeholder="Name" />
      <input name="manufacturer" value={form.manufacturer} onChange={change} placeholder="Manufacturer" />
      <input name="batch" value={form.batch} onChange={change} placeholder="Batch" />
      <input name="expiryDate" value={form.expiryDate} onChange={change} type="date" />
      <div style={{display:'flex',gap:8}}>
        <input name="price" value={form.price} onChange={change} type="number" placeholder="Price" />
        <input name="quantity" value={form.quantity} onChange={change} type="number" placeholder="Quantity" />
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}
