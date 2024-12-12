import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchInquiries } from "../api"; // API 호출 함수

const Inquiry = () => {
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "notice"; // 현재 카테고리

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const data = await fetchInquiries(category); // Node.js API 호출
        setPosts(data);
      } catch (error) {
        console.error("Error loading inquiries:", error);
      }
    };
    loadInquiries();
  }, [category]);

  return (
    <div className="inquiry-container">
      <h1 className="inquiry-title">문의 게시판</h1>

      {/* 카테고리 탭 */}
      <div className="board-tabs">
        <Link to="?category=notice" className={`tab-link ${category === "notice" ? "active" : ""}`}>
          공지사항
        </Link>
        <Link to="?category=qna" className={`tab-link ${category === "qna" ? "active" : ""}`}>
          Q&A
        </Link>
        <Link to="?category=free" className={`tab-link ${category === "free" ? "active" : ""}`}>
          자유게시판
        </Link>
      </div>

      {/* 게시글 목록 */}
      <table className="inquiry-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/inquiry/detail/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.author || "익명"}</td>
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                <td>{post.views}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">등록된 게시물이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 글쓰기 버튼 */}
      <div className="write-button-container">
        <Link to={`/inquiry/write?category=${category}`} className="write-button">
          글쓰기
        </Link>
      </div>
    </div>
  );
};

export default Inquiry;
