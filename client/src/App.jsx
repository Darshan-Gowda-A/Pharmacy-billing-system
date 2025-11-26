import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Medicines from "./pages/Medicines";
import AddMedicine from "./pages/AddMedicine";
import Billing from "./pages/Billing";
import Invoice from "./pages/Invoice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/invoice/:id" element={<Invoice />} />
      </Routes>
    </BrowserRouter>
  );
}
