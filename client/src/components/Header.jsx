import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header(){
  const nav = useNavigate();
  function logout(){
    localStorage.removeItem('token');
    nav('/');
  }
  return (
    <header>
      <div className="brand">Pharmacy Billing</div>
      <nav>
        <Link to="/medicines" style={{marginRight:12}}>Medicines</Link>
        <Link to="/billing" style={{marginRight:12}}>Billing</Link>
        <Link to="/add-medicine" style={{marginRight:12}}>Add</Link>
        <button onClick={logout} style={{padding:'6px 10px'}}>Logout</button>
      </nav>
    </header>
  );
}
