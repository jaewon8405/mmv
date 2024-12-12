import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchInquiry, fetchComments, createComment, deleteComment, updateComment, updateInquiry, deleteInquiry } from "../api"; // API 호출 함수

const InquiryDetail = () => {
  const { id } = useParams(); // 게시글 ID 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션
  const [post, setPost] = useState(null); // 게시글 데이터
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editedTitle, setEditedTitle] = useState(""); // 수정된 제목
  const [editedContent, setEditedContent] = useState(""); // 수정된 내용
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [newComment, setNewComment] = useState(""); // 새 댓글

  useEffect(() => {
    loadPostAndComments();
  }, [id]);

  const loadPostAndComments = async () => {
    try {
      const postData = await fetchInquiry(id); // 게시글 데이터 로드
      setPost(postData);
      setEditedTitle(postData.title);
      setEditedContent(postData.content);

      const commentsData = await fetchComments(id); // 댓글 데이터 로드
      setComments(commentsData);
    } catch (error) {
      console.error("Error loading post or comments:", error);
    }
  };

  const handleEditSave = async () => {
    if (!editedTitle || !editedContent) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    try {
      await updateInquiry(id, { title: editedTitle, content: editedContent }); // API 호출
      alert("게시글이 수정되었습니다.");
      setPost({ ...post, title: editedTitle, content: editedContent });
      setIsEditing(false); // 수정 모드 해제
    } catch (error) {
      console.error("Error saving edited post:", error);
    }
  };
  

  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await deleteInquiry(id); // API 호출로 게시글 삭제
        alert("게시글이 삭제되었습니다.");
        navigate(`/inquiry?category=${post.category}`); // 삭제 후 해당 카테고리 목록으로 이동
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const newCommentData = await createComment({ post_id: id, content: newComment });
      setComments([...comments, newCommentData]); // 서버에서 받은 시간 정보 포함
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  

  if (!post) return <p>로딩 중입니다...</p>;

  const handleCommentDelete = async (commentId) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await deleteComment(commentId); // 댓글 삭제 API 호출
        setComments((prevComments) => prevComments.filter((c) => c.id !== commentId)); // 삭제된 댓글 제거
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleCommentEdit = async (commentId, newContent) => {
    if (!newContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    try {
      await updateComment(commentId, { content: newContent }); // API 호출
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, content: newContent, isEditing: false } : comment
        )
      );
      alert("댓글이 수정되었습니다.");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleEditClick = () => {
    setEditedTitle(post?.title || ""); // 기존 제목을 수정 상태에 설정
    setEditedContent(post?.content || ""); // 기존 내용을 수정 상태에 설정
    setIsEditing(true); // 수정 모드 활성화
  };
  
  const handleEditCancel = () => {
    setIsEditing(false); // 수정 모드 해제
  };

  const handleCommentEditClick = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, isEditing: true } : comment
      )
    );
  };
  
  const handleCommentEditCancel = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, isEditing: false } : comment
      )
    );
  };
  

  return (
    <div className="detail-container">
      {/* 글 정보 박스 */}
      <div className="detail-info">
        <h1 className="detail-title"> {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        ) : (
          post?.title
        )}</h1>
        <div className="detail-meta">
          <span>작성자: {post?.author || "익명"}</span>
          <span>작성일: {new Date(post?.created_at).toLocaleDateString()}</span>
          <span>조회수: {post?.views}</span>
        </div>
      </div>
  
      {/* 본문 */}
      <div className="detail-content">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows="5"
          />
        ) : (
          <p>{post?.content}</p>
        )}
      </div>
  
      {/* 글 수정 및 삭제 버튼 */}
      <div className="detail-buttons">
        {isEditing ? (
          <>
            <button onClick={handleEditSave} className="btn-save">저장</button>
            <button onClick={handleEditCancel} className="btn-cancel">취소</button>
          </>
        ) : (
          <>
            <button onClick={handleEditClick} className="btn-edit">수정</button>
            <button onClick={handleDelete} className="btn-delete">삭제</button>
          </>
        )}
        <button onClick={() => navigate(`/inquiry?category=${post.category}`)} className="btn-back">
          목록으로
        </button>
      </div>
  
      {/* 댓글 섹션 */}
      <div className="comment-section">
        <h2>댓글</h2>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows="3"
          />
          <button type="submit" className="btn-add-comment">댓글 추가</button>
        </form>
  
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              {comment.isEditing ? (
                <div>
                  <textarea
                    value={comment.content}
                    onChange={(e) =>
                      setComments((prevComments) =>
                        prevComments.map((c) =>
                          c.id === comment.id ? { ...c, content: e.target.value } : c
                        )
                      )
                    }
                    rows="2"
                  />
                  <button onClick={() => handleCommentEdit(comment.id, comment.content)}>저장</button>
                  <button onClick={() => handleCommentEditCancel(comment.id)}>취소</button>
                </div>
              ) : (
                <div>
                  <p>{comment.content}</p>
                  <small>
                    작성 시간: {new Date(comment.created_at).toLocaleString()}
                    {comment.updated_at && ` (수정됨: ${new Date(comment.updated_at).toLocaleString()})`}
                  </small>
                  <div className="comment-actions">
                    <button onClick={() => handleCommentEditClick(comment.id)}>수정</button>
                    <button onClick={() => handleCommentDelete(comment.id)}>삭제</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InquiryDetail;
