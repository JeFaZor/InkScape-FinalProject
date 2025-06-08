
import './i18n'; 
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

import Dashboard from './components/Dashboard';
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ArtistProfile from './components/artist/ArtistProfile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar8 />
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={AuthScreen} path="/auth" />
          <Route component={ArtistProfile} path="/artist/:name" />
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