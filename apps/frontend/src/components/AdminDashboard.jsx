import React from "react";
import { Link } from 'react-router-dom';
import { UserPermissions } from "../utils/permissions";

const AdminDashboard = ({permissions}) => {
    console.log("Admin Dashboard");
    return (
        <nav>
            <ul className="nav-links">

                {permissions.includes(UserPermissions.WRITE) &&
                <li><Link to="/create-payment">Create Payment</Link></li> 
                }
                {permissions.includes(UserPermissions.WRITE) &&
                <li><Link to="/create-user">Create User</Link></li>}

                {permissions.includes(UserPermissions.READ) &&
                <li><Link to="/list-users">List Users</Link></li>}

                {permissions.includes(UserPermissions.READ) &&
                <li><Link to="/list-payments">List Payments</Link></li>} 
                
            </ul>
        </nav>
    )
}

export default AdminDashboard;