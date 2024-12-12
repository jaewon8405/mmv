import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createInquiry } from "../api"; // 글 작성 API 호출 함수

const InquiryWrite = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "notice"; // URL에서 카테고리 가져오기
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      await createInquiry({ category, title, content }); // API 호출
      alert("게시글이 성공적으로 등록되었습니다.");
      navigate(`/inquiry?category=${category}`); // 등록 후 해당 카테고리로 이동
    } catch (error) {
      console.error("Error creating inquiry:", error);
    }
  };

  return (
    <div className="write-container">
      <h1 className="page-title">게시글 작성</h1>
      <form onSubmit={handleSubmit} className="write-form">
        <table className="write-table">
          <tbody>
            <tr>
              <th>카테고리</th>
              <td>
                <select disabled>
                  <option>{category}</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>제목</th>
              <td>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows="10"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="button-group">
          <button type="submit" className="btn-primary">등록</button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/inquiry?category=${category}`)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryWrite;
