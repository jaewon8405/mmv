import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const InquiryWrite = ({ categories, setCategories }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'notice';
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content || !author) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      content,
      author,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
    };

    setCategories((prevCategories) => {
      const updatedCategory = prevCategories[category] || [];
      return {
        ...prevCategories,
        [category]: [...updatedCategory, newPost],
      };
    });

    navigate(`/inquiry?category=${category}`);
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
        <div className="form-group">
          <label htmlFor="author">작성자</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="form-input"
            placeholder="작성자를 입력하세요"
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
