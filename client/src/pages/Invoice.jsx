import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Header from "../components/Header";

export default function Invoice() {
  const { id } = useParams();
  const nav = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!id) { setErr('No invoice id'); setLoading(false); return; }
    setLoading(true);
    API.get(`/sales/${id}`)
      .then(r => setSale(r.data))
      .catch(e => {
        console.error(e);
        setErr(e?.response?.data?.msg || e.message || 'Error');
        if (e?.response?.status === 401) { localStorage.removeItem('token'); setTimeout(()=>nav('/'),800); }
      })
      .finally(()=>setLoading(false));
  }, [id, nav]);

  if (loading) return (<div><Header /><main><div className="card">Loading invoice…</div></main></div>);

  return (
    <div>
      <Header />
      <main>
        <div className="card">
          <h3>Invoice</h3>
          {err && <div style={{color:'crimson'}}>{err}</div>}
          {!err && !sale && <div>No data returned</div>}
          {sale && (
            <>
              <div>Invoice: {sale._id}</div>
              <div>Date: {new Date(sale.createdAt).toLocaleString()}</div>
              <table className="table" style={{marginTop:12}}>
                <thead><tr><th>Name</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {sale.items.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.name}</td>
                      <td>{it.qty}</td>
                      <td>₹{it.price}</td>
                      <td>₹{it.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{textAlign:'right',marginTop:8}}>
                <div>Total: ₹{sale.total}</div>
                <div>Tax: ₹{sale.tax}</div>
                <div style={{fontWeight:700}}>Grand Total: ₹{sale.grandTotal}</div>
              </div>
              <div style={{marginTop:8}}>
                <button onClick={() => window.print()} className="btn btn-primary">Print</button>
              </div>
            </>
          )}
        </div>
        <details style={{marginTop:12}}>
          <summary>Debug response</summary>
          <pre>{JSON.stringify(sale,null,2)}</pre>
        </details>
      </main>
    </div>
  );
}
