import React from 'react';
import './styles/App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
