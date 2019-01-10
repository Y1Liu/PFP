import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Login2 from './components/Login2'
import Register from './components/Register'
import Profile from './components/Profile'
import Form from './components/Form'
import Map from './components/Map'
import './App.css'


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/map" component={Map} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login2" component={Login2} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/form" component={Form} />
        
          </div>
        </div>
      </Router>
    )
  }
}

export default App
