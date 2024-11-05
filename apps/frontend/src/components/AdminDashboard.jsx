import React from "react";
import { Link } from 'react-router-dom';

const AdminDashboard = ({permissions}) => {
    return (
        <nav>
            <ul className="nav-links">

                {permissions[1] &&
                <li><Link to="/create-payment">Create Payment</Link></li> 
                }
                {permissions[1] &&
                <li><Link to="/create-user">Create User</Link></li>}

                {permissions[0] &&
                <li><Link to="/list-users">List Users</Link></li>}

                {permissions[0] &&
                <li><Link to="/list-payments">List Payments</Link></li>} 
                
            </ul>
        </nav>
    )
}

export default AdminDashboard;