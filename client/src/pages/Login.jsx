import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const nav = useNavigate();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    try {
      const res = await API.post('/auth/login',{ email, password });
      localStorage.setItem('token', res.data.token);
      nav('/medicines');
    } catch (err) {
      console.error(err);
      setErr(err?.response?.data?.msg || 'Login failed');
    }
  }

  return (
    <main style={{maxWidth:420, margin:'40px auto'}}>
      <div className="card">
        <h2>Login</h2>
        {err && <div style={{color:'crimson'}}>{err}</div>}
        <form onSubmit={submit} style={{display:'grid',gap:8}}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </main>
  );
}
