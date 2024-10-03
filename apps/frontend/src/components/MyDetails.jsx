import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { getUserDetails } from '../services/apiService';
import '../styles/List.css';

const MyDetails = () => {
    const [userDetails, setUserDetails] = useState([]);
    const { id } = useParams();
    const jwtToken = useSelector((state) => state.loginReducer.jwtSession);

    useEffect(() => {
        const fetchUserDetails = async () => {
          try {
            const response = await getUserDetails(id, jwtToken);
            setUserDetails(response.data);
          } catch (error) {
            alert('Failed to fetch user details');
          }
        };
    
        fetchUserDetails();
    }, [id, jwtToken]);
    return (
        <table className='user-table'>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{userDetails.username}</td>
                    <td>{userDetails.email}</td>
                    <td>{userDetails.balance}</td>
                </tr>
            </tbody> 
                        
            {userDetails.payments && 
                <tbody>
                    <tr>
                        <th colSpan={3}>Payments</th>
                    </tr>
                    {userDetails.payments.map((payment) => (
                        <tr key={payment.id}>
                            <td>{payment.label}</td>
                            <td>${payment.amount}</td>
                            <td>${payment.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            }
        </table>
    )
}

export default MyDetails;