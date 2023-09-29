import React from 'react'
import ChatRoom from './components/ChatRoom'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/chat" element={<ChatRoom/>} />
        <Route path="/" element={<ChatRoom/>} />
      </Routes>
    </Router>
  )
}

export default App;