import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const userId = useSelector((state) => state.loginReducer.userId);
  return (
      <nav>
        <ul className="nav-links">
          <li><Link to={`/my-details/${userId}`}>My Details</Link></li>
          <li><Link to="/my-payments">My Payments</Link></li>
          <li><Link to="/create-payment">Create Payment</Link></li>
        </ul>
      </nav>
  )
}

export default UserDashboard;
