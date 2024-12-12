import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { initializeDatabase, updateInquiry, deleteInquiry, incrementViews, db } from "../db";

const InquiryDetail = ({ categories }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [hasIncremented, setHasIncremented] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const initDBAndIncrementViews = async () => {
      if (!hasIncremented){
        try {
          await initializeDatabase(); // 데이터베이스 초기화
          await incrementViews(id); // 조회수 증가
          setHasIncremented(true);
        } catch (error) {
          console.error("Error initializing database or incrementing views:", error);
        }
      }
    };
    initDBAndIncrementViews();
  }, [id, hasIncremented]);

  useEffect(() => {
    const loadPost = async () => {
      try {
        await initializeDatabase();
        const stmt = db.prepare(`SELECT * FROM inquiries WHERE id = ?`);
        stmt.bind([id]); // id로 바인딩
        const post = stmt.step() ? stmt.getAsObject() : null;
        setPost(post);
        if (post) {
          setEditedTitle(post.title);
          setEditedContent(post.content);
        }
        stmt.free();
      } catch (error) {
        console.error("Error loading post:", error);
      }
    };

    const loadComments = async () => {
      try {
        const stmt = db.prepare(`SELECT * FROM comments WHERE postId = ?`);
        stmt.bind([id]);
        const loadedComments = [];
        while (stmt.step()) {
          loadedComments.push(stmt.getAsObject());
        }
        setComments(loadedComments);
        stmt.free();
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };

    loadPost();
    loadComments();
  }, [id]);

  if (!post) {
    return <p>로딩 중입니다...</p>; // 로딩 상태 추가
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const stmt = db.prepare(`INSERT INTO comments (postId, content, createdAt) VALUES (?, ?, ?)`);
      stmt.run([id, newComment, new Date().toISOString()]);
      stmt.free();
      setComments([...comments, { postId: id, content: newComment, createdAt: new Date().toISOString() }]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

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
    <div className="inquiry-detail-container">
      {isEditing ? (
        <div className="edit-container">
          <h2>게시물 수정</h2>
          <div className="form-group">
            <label>제목</label>
            <input
              className="form-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>내용</label>
            <textarea
              className="form-textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows="5"
            />
          </div>
          <button className="save-button" onClick={handleEditSave}>저장</button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>취소</button>
        </div>
      ) : (
        <>
          <table className="detail-table">
            <tbody>
              <tr>
                <td className="detail-header">제목</td>
                <td className="detail-data">{post.title}</td>
              </tr>
              <tr>
                <td className="detail-header">작성자</td>
                <td className="detail-data">{post.author || "익명"}</td>
              </tr>
              <tr>
                <td className="detail-header">작성일</td>
                <td className="detail-data">{post.createdAt}</td>
              </tr>
              <tr>
                <td className="detail-header">내용</td>
                <td className="detail-data">{post.content}</td>
              </tr>
            </tbody>
          </table>
          <div className="detail-actions">
            <button className="edit-button" onClick={() => setIsEditing(true)}>수정</button>
            <button className="delete-button" onClick={handleDelete}>삭제</button>
          </div>
        </>
      )}
      <div className="comments-section">
        <h2>댓글</h2>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows="3"
          />
          <button type="submit" className="submit-button">등록</button>
        </form>
        <div className="comment-list">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <p>{comment.content}</p>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </div>
      </div>
      <div className="detail-actions">
        <button className="back-button" onClick={() => navigate("/inquiry")}>목록으로</button>
      </div>
    </div>
  );
};

export default InquiryDetail;
