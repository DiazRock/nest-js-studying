// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import ListUsers from './components/ListUsers';
import CreatePayment from './components/CreatePayment';
import ListPayments from './components/ListPayments';
import './styles/App.css';

const App = () => {
  return (
    <div className="container">
      <Router>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/create-user" component={CreateUser} />
          <Route path="/list-users" component={ListUsers} />
          <Route path="/create-payment" component={CreatePayment} />
          <Route path="/list-payments" component={ListPayments} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
