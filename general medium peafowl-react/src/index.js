import './styles/tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import './style.css';
import Home from './views/home';
import NotFound from './views/not-found';
import GetStarted from './components/get-started/get-started';
import Navbar8 from './components/navbar8';
import AuthScreen from './components/auth/AuthScreen';
import TestComponent from './components/TestComponent';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar8 />
        <Switch>
          <Route component={TestComponent} path="/test" />
          <Route component={Home} exact path="/" />
          <Route component={GetStarted} path="/get-started" />
          <Route component={AuthScreen} path="/auth" />
          
          {/* Protected routes - for pages that require authentication */}
          <Route 
            path="/dashboard" 
            render={props => (
              <ProtectedRoute>
                <Dashboard {...props} />
              </ProtectedRoute>
            )} 
          />
          
          <Route component={NotFound} path="**" />
          <Redirect to="**" />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));