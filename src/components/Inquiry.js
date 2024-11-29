import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Inquiry = ({ categories, setCategories }) => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'notice';
  const selectedCategory = categories[category] || [];

  return (
    <div className="board-container">
      <h1 className="board-title">게시판</h1>

      {/* 카테고리 탭 */}
      <div className="board-tabs">
        <Link
          to="?category=notice"
          className={`tab-link ${category === 'notice' ? 'active' : ''}`}
        >
          공지 사항
        </Link>
        <Link
          to="?category=qna"
          className={`tab-link ${category === 'qna' ? 'active' : ''}`}
        >
          Q&A
        </Link>
        <Link
          to="?category=free"
          className={`tab-link ${category === 'free' ? 'active' : ''}`}
        >
          자유
        </Link>
      </div>

      {/* 게시판 목록 */}
      <div className="board-list">
        <table className="board-table">
          <thead>
            <tr>
              <th className="board-header">번호</th>
              <th className="board-header">제목</th>
              <th className="board-header">작성자</th>
              <th className="board-header">작성일</th>
              <th className="board-header">조회</th>
            </tr>
          </thead>
          <tbody>
            {selectedCategory.length === 0 ? (
              <tr>
                <td colSpan="5" className="board-no-data">
                  등록된 게시물이 없습니다.
                </td>
              </tr>
            ) : (
              selectedCategory.map((post, index) => (
                <tr key={post.id} className="board-row">
                  <td className="board-data">{index + 1}</td>
                  <td className="board-data">
                    <Link to={`/inquiry/detail/${post.id}`} className="board-link">
                      {post.title}
                    </Link>
                  </td>
                  <td className="board-data">{post.author}</td>
                  <td className="board-data">{post.createdAt}</td>
                  <td className="board-data">{post.views}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 글쓰기 버튼 */}
      <div className="board-footer">
        <Link to={`/inquiry/write?category=${category}`} className="board-write-button">
          글쓰기
        </Link>
      </div>
    </div>
  );
};

export default Inquiry;
