import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { initializeDatabase, updateInquiry, deleteInquiry, incrementViews } from "../db";

const InquiryDetail = ({ categories }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const initDBAndIncrementViews = async () => {
      try {
        await initializeDatabase(); // 데이터베이스 초기화
        await incrementViews(id); // 조회수 증가
      } catch (error) {
        console.error("Error initializing database or incrementing views:", error);
      }
    };
    initDBAndIncrementViews();
  }, [id]);

  const handleEditSave = async () => {
    if (!editedTitle || !editedContent) {
      alert("제목과 내용을 입력하세요.");
      return;
    }
    try {
      await updateInquiry(post.id, editedTitle, editedContent); // DB 업데이트
      alert("수정되었습니다.");
      setIsEditing(false);
      setPost({ ...post, title: editedTitle, content: editedContent }); // 상태 업데이트
    } catch (error) {
      console.error("Error saving edited post:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
      try {
        await deleteInquiry(post.id); // DB에서 삭제
        alert("삭제되었습니다.");
        navigate("/inquiry");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (!post) return <p>게시물을 찾을 수 없습니다.</p>;

  return (
    <div>
      {!isEditing ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <button onClick={() => setIsEditing(true)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </>
      ) : (
        <>
          <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
          <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
          <button onClick={handleEditSave}>저장</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </>
      )}
    </div>
  );
};

export default InquiryDetail;
