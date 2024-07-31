// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import RoutesDefinitions from './components/RoutesDefinitions';
import './styles/App.css';


const App = () => {
  return (
    <Provider store = {store} >
      <div className="container">
        <Router>
            <RoutesDefinitions/>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
