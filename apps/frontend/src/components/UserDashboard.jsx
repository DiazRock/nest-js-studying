import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    return (
        <nav>
          <ul className="nav-links">
            <li><Link to="/my-details">My Details</Link></li>
            <li><Link to="/my-payments">My Payments</Link></li>
            <li><Link to="/create-payment">Create Payment</Link></li>
          </ul>
        </nav>
    )
}

export default UserDashboard;
