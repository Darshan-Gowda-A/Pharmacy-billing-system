import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function Billing() {
  const nav = useNavigate();
  const loc = useLocation();
  const addId = loc.state?.add;
  const [meds, setMeds] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, []);

  useEffect(() => {
    if (addId) {
      const m = meds.find(x => x._id === addId);
      if (m) addToCart(m);
    }
  }, [addId, meds]);

  async function load() {
    try {
      setLoading(true);
      const { data } = await API.get('/medicines');
      setMeds(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  function addToCart(med) {
    setCart(prev => {
      const p = prev.find(x => x.medicine === med._id);
      if (p) return prev.map(x => x.medicine === med._id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { medicine: med._id, name: med.name, price: med.price, qty: 1, gstPercent: med.gstPercent || 0 }];
    });
  }

  function removeItem(medId) {
    setCart(prev => prev.filter(x => x.medicine !== medId));
  }

  async function generateInvoice() {
    if (!cart.length) return alert('Cart empty');
    try {
      const payload = { items: cart };
      const res = await API.post('/sales', payload);
      nav(`/invoice/${res.data._id}`);
    } catch (err) {
      alert(err?.response?.data?.msg || 'Sale failed');
    }
  }

  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);

  return (
    <div>
      <Header />
      <main style={{display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <h2>Medicines</h2>
          <div className="card">
            {loading && <div>Loading...</div>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
              {meds.map(m => (
                <div key={m._id} className="card">
                  <div style={{fontWeight:700}}>{m.name}</div>
                  <div>₹{m.price}</div>
                  <div>Qty: {m.quantity}</div>
                  <button onClick={() => addToCart(m)} style={{marginTop:8}}>Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{width:320}}>
          <div className="card">
            <h3>Cart</h3>
            {cart.length === 0 && <div>No items</div>}
            {cart.map(c => (
              <div key={c.medicine} style={{display:'flex',justifyContent:'space-between',padding:'6px 0'}}>
                <div>{c.name} x {c.qty}</div>
                <div>₹{c.price * c.qty}</div>
              </div>
            ))}
            <hr />
            <div style={{display:'flex',justifyContent:'space-between',fontWeight:700}}>
              <div>Total</div><div>₹{total}</div>
            </div>
            <button className="btn btn-primary" style={{width:'100%',marginTop:8}} onClick={generateInvoice}>Generate Invoice</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
