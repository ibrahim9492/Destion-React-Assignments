import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assets/App.css';

const InvoiceList = ({ invoices, onSelectInvoice }) => (
  <div className="invoice-list">
    <h2>Invoices</h2>
    <ul>
      {invoices.map(invoice => (
        <li 
          key={invoice.orderId} 
          className="invoice-item" 
          onClick={() => { 
            console.log('Selected Invoice:', invoice);
            onSelectInvoice(invoice); // Directly updating state
          }}
        >
          {invoice.storeName} - Order #{invoice.orderId}
        </li>
      ))}
    </ul>
  </div>
);

const InvoiceDetail = ({ invoice }) => {
  if (!invoice) return <p className="invoice-message">Select an invoice to view details</p>;

  console.log('Rendering InvoiceDetail:', invoice);

  const grandTotalWithoutTax = (invoice.items ?? []).reduce((sum, item) => sum + Number(item.itemTotal || 0), 0);
  const grandTotalWithTax = (invoice.items ?? []).reduce((sum, item) => sum + Number(item.itemTotal || 0) + Number(item.tax?.amount || 0), 0);

  return (
    <div className="invoice-detail">
      <h2>Invoice Details</h2>
      <p><strong>Store:</strong> {invoice.storeName}</p>
      <p><strong>Order ID:</strong> {invoice.orderId}</p>
      <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
      <h3>Items:</h3>
      <ul>
        {(invoice.items ?? []).map((item, index) => (
          <li key={item.itemId || index} className="invoice-item-detail">
            {item.name || 'Unknown Item'}: {item.quantity || 0} x $
            {item.dealPrice || item.regularPrice || 0} = $
            {item.itemTotal || 0} (+${item.tax?.amount || 0} tax)
          </li>
        ))}
      </ul>
      <h3>Grand Total</h3>
      <p className="grand-total">Without Tax: ${grandTotalWithoutTax.toFixed(2)}</p>
      <p className="grand-total">With Tax: ${grandTotalWithTax.toFixed(2)}</p>
    </div>
  );
};

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    axios.get('/invoices.json') // Mock API or local JSON
      .then(response => {
        console.log('Fetched Invoices:', response.data);
        setInvoices(response.data);
      })
      .catch(error => console.error('Error fetching invoices:', error));
  }, []);

  return (
    <div className="invoice-manager">
      <InvoiceList invoices={invoices} onSelectInvoice={setSelectedInvoice} />
      <InvoiceDetail invoice={selectedInvoice} />
    </div>
  );
};

export default InvoiceManager;
