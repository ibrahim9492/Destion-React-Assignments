import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assets/App.css'

const ProductList = ({ products, onSelectProduct, onDeleteProduct }) => (
  <div className="product-list">
    <h2>Product List</h2>
    <ul>
      {products.map(product => (
        <li key={product.id} className="product-item">
          <span>{product.name} - {product.store}</span>
          <button className="edit-btn" onClick={() => onSelectProduct(product)}>Edit</button>
          <button className="delete-btn" onClick={() => onDeleteProduct(product.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

const ProductDetail = ({ product }) => {
  if (!product) return <p className="product-message">Select a product to view details</p>;

  return (
    <div className="product-detail">
      <h2>Product Detail</h2>
      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Store:</strong> {product.store}</p>
      <p><strong>Price:</strong> ${product.price}</p>
    </div>
  );
};

const ProductForm = ({ product, onSave }) => {
  const [formData, setFormData] = useState(product || { name: '', store: '', price: '' });

  useEffect(() => {
    setFormData(product || { name: '', store: '', price: '' });
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required />
      <input name="store" value={formData.store} onChange={handleChange} placeholder="Store Name" required />
      <input name="price" value={formData.price} onChange={handleChange} type="number" placeholder="Price" required />
      <button type="submit" className="save-btn">Save</button>
    </form>
  );
};

const StoreFilter = ({ stores, selectedStore, onSelectStore }) => (
  <select className="store-filter" value={selectedStore} onChange={(e) => onSelectStore(e.target.value)}>
    <option value="">All Stores</option>
    {stores.map(store => (
      <option key={store} value={store}>{store}</option>
    ))}
  </select>
);

const SearchBar = ({ searchTerm, onSearch }) => (
  <input className="search-bar" type="text" value={searchTerm} onChange={(e) => onSearch(e.target.value)} placeholder="Search products..." />
);

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  useEffect(() => {
    axios.get('/products.json')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleSaveProduct = (product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      return exists ? prev.map(p => (p.id === product.id ? product : p)) : [...prev, { ...product, id: Date.now() }];
    });
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => 
    (!selectedStore || p.store === selectedStore) &&
    (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="product-manager">
      <h1>Product Management</h1>
      <div className="controls">
        <StoreFilter stores={[...new Set(products.map(p => p.store))]} selectedStore={selectedStore} onSelectStore={setSelectedStore} />
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      </div>
      <ProductList products={filteredProducts} onSelectProduct={setSelectedProduct} onDeleteProduct={handleDeleteProduct} />
      <ProductDetail product={selectedProduct} />
      <ProductForm product={selectedProduct} onSave={handleSaveProduct} />
    </div>
  );
};

export default ProductManager;
