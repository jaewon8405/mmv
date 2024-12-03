import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Transform from './components/Transform';
import Inquiry from './components/Inquiry.js';
import './App.css';
import mmvLogo from './mmvlogo.png'; // 로고 이미지 경로
import InquiryWrite from './components/InquiryWrite';
import Cost from './components/Cost.js';
import Login from './components/Login.js';


const App = () => {
  const navbarHeight = 60;

  const [categories, setCategories] = useState({
    general: [],
    ads: [],
    notices: [],
  });

  

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
          </Routes>
        </main>
      </div>
      <Routes>
        {/* Inquiry는 /inquiry 경로에서만 렌더링 */}
        <Route
          path="/inquiry"
          element={<Inquiry categories={categories} setCategories={setCategories} />}
        />
        <Route
          path="/inquiry/write"
          element={<InquiryWrite categories={categories} setCategories={setCategories} />}
        />
      </Routes>
    </Router>
  );
};

const Header = () => {
  const navigate = useNavigate(); // 로그인 버튼 클릭 시 사용
  return (
    <div className="header">
      <h1>My App</h1>
      <button
        className="login-button"
        onClick={() => navigate('/login')} // 로그인 페이지로 이동
      >
        로그인
      </button>
    </div>
  );
};

export default App;
