import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard' 
import Td from './t_d' 
import Advance from './advance'
import LandingPage from './start/Start'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* 2. ADD YOUR NEW ROUTE DOWN HERE */}
        <Route path="/t_d" element={<Td />} /> 
        <Route path="/advance" element={<Advance/>}/>
      </Routes>
    </Router>
  )
}