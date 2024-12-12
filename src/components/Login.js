import React from 'react';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">로그인</h1>
        <form className="login-form">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="아이디"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="비밀번호"
              required
            />
          </div>
          <button type="submit" className="login-button">로그인</button>
        </form>
          <div className="options">
            <button onClick={() => alert('아이디 찾기 기능')} className="option-link">아이디 찾기</button>
              <span className="divider">|</span>
            <button onClick={() => alert('비밀번호 찾기 기능')} className="option-link">비밀번호 찾기</button>
              <span className="divider">|</span>
            <button onClick={() => alert('회원가입 기능')} className="option-link">회원가입</button>
          </div>
      </div>
    </div>
  );
};

export default Login;
