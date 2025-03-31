import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Dashboard} />
      </Switch>
    </Router>
  );
};

export default App;