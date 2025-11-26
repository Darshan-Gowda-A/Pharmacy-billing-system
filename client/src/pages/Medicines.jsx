import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import MedicineRow from '../components/MedicineRow';
import { Link, useNavigate } from 'react-router-dom';

export default function Medicines(){
  const nav = useNavigate();
  const [meds,setMeds] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  useEffect(()=>{ fetchMeds(); }, []);

  async function fetchMeds(){
    setLoading(true);
    try {
      const { data } = await API.get('/medicines');
      setMeds(data);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) { localStorage.removeItem('token'); nav('/'); return; }
      setError(err?.response?.data?.msg || 'Failed to load');
    } finally { setLoading(false); }
  }

  function addToBilling(med){
    nav('/billing', { state: { add: med._id } });
  }

  async function deleteMed(id){
    if (!confirm('Delete medicine?')) return;
    try {
      await API.delete(`/medicines/${id}`);
      setMeds(prev => prev.filter(m=>m._id !== id));
    } catch (err) { alert(err?.response?.data?.msg || 'Delete failed'); }
  }

  return (
    <div>
      <Header />
      <main>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2>Medicines</h2>
          <div>
            <Link to="/add-medicine" className="btn btn-primary">+ Add Medicine</Link>
          </div>
        </div>

        {loading && <div>Loading…</div>}
        {error && <div style={{color:'crimson'}}>{error}</div>}

        <div className="card">
          <table className="table">
            <thead><tr><th>Name</th><th>Batch</th><th>Expiry</th><th>Price</th><th>Qty</th><th>Actions</th></tr></thead>
            <tbody>
              {meds.length===0 && <tr><td colSpan={6}>No medicines</td></tr>}
              {meds.map(m => (
                <MedicineRow
                  key={m._id}
                  med={m}
                  onAdd={addToBilling}
                  onEdit={() => nav('/add-medicine', { state: { edit: m } })}
                  onDelete={() => deleteMed(m._id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
