import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Menu from './components/Menu';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));


  return (
    <Router>
      <div>
        {!token ? (
          <Routes>
            <Route path="/" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        ) : (
          <div>
            
            <Chat />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
