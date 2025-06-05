// src/index.js
import './i18n'; // הוסף את השורה הזו בראש הקובץ
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

import Navbar8 from './components/navbar8';
import AuthScreen from './components/auth/AuthScreen';
import TestComponent from './components/TestComponent';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
// Import the new ArtistProfile component
import ArtistProfile from './components/artist/ArtistProfile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar8 />
        <Switch>
          <Route component={TestComponent} path="/test" />
          <Route component={Home} exact path="/" />
          <Route component={AuthScreen} path="/auth" />
          
          {/* New route for artist profile */}
          <Route component={ArtistProfile} path="/artist/:name" />
          
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