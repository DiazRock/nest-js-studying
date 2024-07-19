import { Route, Routes } from'react-router-dom';
import Register from './Register';
import Login from './Login';
import CreateUser from './CreateUser';
import ListUsers from './ListUsers';
import CreatePayment from './CreatePayment';
import ListPayments from './ListPayments';
import HomeComponent from './HomeComponent';


const RoutesDefinitions = () => {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-user" element={<CreateUser/>} />
            <Route path="/list-users" element={<ListUsers/>} />
            <Route path="/create-payment" element={<CreatePayment/>} />
            <Route path="/list-payments" element={<ListPayments/>} />
            <Route path="/my-payments/:id" element={<ListPayments/>} />
            <Route path="/" element={<HomeComponent/>}/>
        </Routes>
    );
}

export default RoutesDefinitions