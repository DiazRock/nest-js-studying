import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    return (
        <nav>
          <ul className="nav-links">
            <li><Link to="/register">My Payments</Link></li>
          </ul>
        </nav>
    )
}

export default UserDashboard;
