// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesDefinitions from './components/RoutesDefinitions';
import './styles/App.css';


const App = () => {
  return (
    <div className="container">
      <Router>
          <RoutesDefinitions/>
      </Router>
    </div>
  );
};

export default App;
