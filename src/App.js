import React from 'react'
import ChatRoom from './components/ChatRoom'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import { ContextProvider } from './components/contexts/ContextProvider';

const App = () => {
  return (
    <ContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/chat" element={<ChatRoom/>} />
          <Route path="/" element={<ChatRoom/>} />
        </Routes>
      </Router>
    </ContextProvider>
  )
}

export default App;