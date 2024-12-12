import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addInquiry } from "../db";

const InquiryWrite = ({ categories, setCategories, refreshInquiries }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "notice";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !content) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
  
    try {
      await addInquiry(category, title, content); // 데이터 삽입
      alert("글이 성공적으로 등록되었습니다!");
      if (refreshInquiries) {
        refreshInquiries(); // Inquiry.js 상태 업데이트
      }
      navigate(`/inquiry?category=${category}`); 
    } catch (error) {
      console.error("Error adding inquiry:", error);
      alert("글 등록 중 문제가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/inquiry?category=${category}`);
  };

  return (
    <div className="write-container">
      <h1>{category} - 글쓰기</h1>
      <form onSubmit={handleSubmit} className="write-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea"
            placeholder="내용을 입력하세요"
            rows="10"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">등록</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryWrite;
