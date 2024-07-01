// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import ListUsers from './components/ListUsers';
import CreatePayment from './components/CreatePayment';
import ListPayments from './components/ListPayments';
import './styles/App.css';

const App = () => {
  return (
    <div className="container">
      <Router>
        <nav>
          <ul className="nav-links">
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/create-user">Create User</Link></li>
            <li><Link to="/list-users">List Users</Link></li>
            <li><Link to="/create-payment">Create Payment</Link></li>
            <li><Link to="/list-payments">List Payments</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-user" element={<CreateUser/>} />
          <Route path="/list-users" element={<ListUsers/>} />
          <Route path="/create-payment" element={<CreatePayment/>} />
          <Route path="/list-payments" element={<ListPayments/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
