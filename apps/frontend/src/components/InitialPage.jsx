import React from 'react';
import { Link } from 'react-router-dom';

const InitialPage = () => {
    return (
        <nav>
          <ul className="nav-links">
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
    )
}

export default InitialPage;