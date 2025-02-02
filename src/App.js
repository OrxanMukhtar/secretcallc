import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Calculator from './assets/pages/calculator.js';
import Gallery from './assets/pages/gallery.js'
import Registration from './assets/pages/registration.js';
// import Nav from './assets/pages/nav.js'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Calculator />} />
        <Route path='gallery' element={<Gallery />} />
        <Route path='registration' element={<Registration />}/>
      </Routes>
      {/* <Nav /> */}
    </Router>

  );
}

export default App;


