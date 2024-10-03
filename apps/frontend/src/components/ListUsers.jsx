import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { listUsers } from '../services/apiService';
import '../styles/List.css';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const jwtToken = useSelector((state) => state.loginReducer.jwtSession);
  const navigate = useNavigate();
  
  const handleClick = (id) => {
    
    return navigate(`/my-details/${id}`);
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await listUsers(jwtToken);
        setUsers(response.data);
      } catch (error) {
        alert('Failed to fetch users');
      }
    };
    fetchUsers();
  }, [jwtToken]);

  return (
    <div>
      <h2>Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>balance</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => handleClick(user.id)}>
              <td>
                {user.username}
              </td>
              <td>
                {user.email}
              </td>
              <td>
                {user.balance}
              </td>
            </tr> 
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsers;
