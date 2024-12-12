import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './components/Home';
import Transform from './components/Transform';
import Inquiry from './components/Inquiry.js';
import './App.css';
import mmvLogo from './mmvlogo.png'; // 로고 이미지 경로
import InquiryWrite from './components/InquiryWrite';
import Cost from './components/Cost.js';
import Login from './components/Login.js';
import InquiryDetail from './components/InquiryDetail';

import { Buffer } from 'buffer';
import process from 'process';
window.Buffer = Buffer;
window.process = process;


const App = () => {
  const navbarHeight = 60;

  const [categories, setCategories] = useState(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories"));
    if (!storedCategories) {
      const initialCategories = { notice: [], qna: [], free: [] };
      localStorage.setItem("categories", JSON.stringify(initialCategories));
      return initialCategories;
    }
    return storedCategories;
  });

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  return (
    <Router>
      <div className="app-layout">
        {/* 상단 네비게이션 바 */}
        <header className="navbar" style={{ height: `${navbarHeight}px` }}>
          <div className="navbar-left">
            {/* 로고 이미지 */}
            <img src={mmvLogo} alt="MMV Logo" className="navbar-logo" />
          </div>
          <ul className="navbar-center">
            <li><Link to="/" className="navbar-link">소개</Link></li>
            <li><Link to="/Transform" className="navbar-link">변환</Link></li>
            <li><Link to="/inquiry" className="navbar-link">문의</Link></li>
            <li><Link to="/pricing" className="navbar-link">요금</Link></li>
          </ul>
          <div className="navbar-right">
            <Link to="/login" className="navbar-button">로그인</Link>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transform" element={<Transform />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Cost />} /> {/* 요금 안내 페이지 경로 추가 */}
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/inquiry/write" element={<InquiryWrite />} />
            <Route path="/inquiry/detail/:id" element={<InquiryDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};


export default App; 