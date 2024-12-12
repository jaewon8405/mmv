import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getInquiries, initializeDatabase } from "../db";

const Inquiry = ({ categories }) => {
  const [searchParams] = useSearchParams();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const category = (searchParams.get("category") || "notice").toLowerCase();
  console.log("Current category:", category);

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        await initializeDatabase(); // 데이터베이스 초기화 보장
        const inquiries = await getInquiries(category);
        console.log("Loaded inquiries:", inquiries);
        setFilteredPosts(inquiries);
      } catch (error) {
        console.error("Error loading inquiries:", error);
      }
    };
    loadInquiries();
  }, [category]);

  const handleSearch = useCallback(() => {
    if (searchQuery) {
      setFilteredPosts((prevPosts) =>
        prevPosts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);


  return (
    <div className="inquiry-container">
      <h1 className="inquiry-title">문의 게시판</h1>
      <div className="board-tabs">
        <Link to="?category=notice" className={`tab-link ${category === "notice" ? "active" : ""}`}>
          공지 사항
        </Link>
        <Link to="?category=qna" className={`tab-link ${category === "qna" ? "active" : ""}`}>
          Q&A
        </Link>
        <Link to="?category=free" className={`tab-link ${category === "free" ? "active" : ""}`}>
          자유
        </Link>
      </div>
      <div className="search-container">
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">검색</button>
        </form>
      </div>
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
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (  
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/inquiry/detail/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.author || "익명"}</td>
                <td>{post.createdAt}</td>
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
      <div className="write-button-container">
        <Link to={`/inquiry/write?category=${category}`} className="write-button">
          글쓰기
        </Link>
      </div>
    </div>
  );
};

export default Inquiry;
