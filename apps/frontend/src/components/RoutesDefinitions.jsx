import { Route, Routes } from'react-router-dom';
import Register from './Register';
import Login from './Login';
import ListUsers from './ListUsers';
import CreatePayment from './CreatePayment';
import ListPayments from './ListPayments';
import HomeComponent from './HomeComponent';
import MyPayments from './MyPayments';
import MyDetails from './MyDetails';


const RoutesDefinitions = () => {
    return (
        <Routes>
            <Route path="/register" element={<Register Header={"Register"} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-user" element={<Register Header={"Create User"}/>} />
            <Route path="/list-users" element={<ListUsers/>} />
            <Route path="/create-payment" element={<CreatePayment/>} />
            <Route path="/list-payments" element={<ListPayments/>} />
            <Route path="/my-payments" element={<MyPayments/>} />
            <Route path="/my-details" element={<MyDetails/>} />
            <Route path="/" element={<HomeComponent/>}/>
        </Routes>
    );
}

export default RoutesDefinitions