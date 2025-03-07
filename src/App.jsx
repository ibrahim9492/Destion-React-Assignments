import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InvoiceManager from "./InvoiceManager";
import ProductManager from "./ProductManager";
import "./assets/App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Invoice Generator</Link>
            </li>
            <li>
              <Link to="/products">Product Management</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<InvoiceManager />} />
          <Route path="/products" element={<ProductManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
