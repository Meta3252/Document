import React from 'react';
import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Carbon Conversion</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        ยินดีต้อนรับเข้าสู่เว็บไซต์ Demo Carbon Conversion เว็บไซต์สำหรับการแปลงค่า Carbon.
      </p>
      <div className="flex gap-4">
        <Link to="/type1" className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition">
          เริ่มต้นใช้งาน
        </Link>
        <Link to="/version" className="px-6 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition">
          เวอร์ชั่นปัจจุบัน
        </Link>
      </div>
      <div className="mt-10">
        <img src="/images/logo-brand.png" alt="Carbon Conversion"  />
      </div>
    </div>
  );
}
