import React, { useState } from 'react';
import Header from '../components/Header';
import API from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AddMedicine(){
  const nav = useNavigate();
  const loc = useLocation();
  const edit = loc.state?.edit;
  const [form,setForm] = useState({
    name: edit?.name || '', manufacturer: edit?.manufacturer || '',
    batch: edit?.batch || '', expiryDate: edit?.expiryDate ? new Date(edit.expiryDate).toISOString().slice(0,10) : '',
    price: edit?.price || 0, mrp: edit?.mrp || 0, quantity: edit?.quantity || 0, gstPercent: edit?.gstPercent || 0
  });

  async function save(e){
    e.preventDefault();
    try {
      if (edit) {
        await API.put(`/medicines/${edit._id}`, { ...form, price: Number(form.price), quantity: Number(form.quantity), gstPercent: Number(form.gstPercent) });
      } else {
        await API.post('/medicines', { ...form, price: Number(form.price), quantity: Number(form.quantity), gstPercent: Number(form.gstPercent) });
      }
      nav('/medicines');
    } catch (err) {
      alert(err?.response?.data?.msg || 'Save failed');
    }
  }

  function change(e){
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  return (
    <div>
      <Header />
      <main style={{maxWidth:760, margin:'20px auto'}}>
        <div className="card">
          <h3>{edit ? 'Edit' : 'Add'} Medicine</h3>
          <form onSubmit={save} style={{display:'grid', gap:8}}>
            <input name="name" value={form.name} onChange={change} placeholder="Name" />
            <input name="manufacturer" value={form.manufacturer} onChange={change} placeholder="Manufacturer" />
            <div style={{display:'flex',gap:8}}>
              <input name="batch" value={form.batch} onChange={change} placeholder="Batch" />
              <input name="expiryDate" value={form.expiryDate} onChange={change} type="date" />
            </div>
            <div style={{display:'flex',gap:8}}>
              <input name="price" value={form.price} onChange={change} type="number" placeholder="Price" />
              <input name="quantity" value={form.quantity} onChange={change} type="number" placeholder="Quantity" />
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
              <button onClick={()=>nav('/medicines')} type="button">Cancel</button>
              <button className="btn btn-primary" type="submit">{edit ? 'Save' : 'Add'}</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
