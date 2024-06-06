import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Login.css'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password
      });

      if (response.data.success) {
        localStorage.setItem('isLoggedIn', true);
        setLoggedIn(true);
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการลงชื่อเข้าใช้');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      window.location.href = '/Homepage';
    }
  }, [loggedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-pink-400 overflow-hidden">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-gray-700">เข้าสู่ระบบ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">ชื่อผู้ใช้:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">รหัสผ่าน:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition duration-300">เข้าสู่ระบบ</button>
          {error && <div className="mt-4 text-red-500">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
