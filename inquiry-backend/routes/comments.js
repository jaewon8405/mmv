const express = require("express");
const db = require("../config/db");

const router = express.Router();

// 댓글 가져오기
router.get("/:post_id", (req, res) => {
  const { post_id } = req.params;
  const query = "SELECT * FROM comments WHERE post_id = ?";
  db.query(query, [post_id], (err, results) => {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      res.json(results);
    }
  });
});

// 댓글 추가
router.post("/", (req, res) => {
  const { post_id, content } = req.body;
  const created_at = new Date(); // 현재 시간
  const query = "INSERT INTO comments (post_id, content, created_at) VALUES (?, ?, ?)";
  db.query(query, [post_id, content, created_at], (err, result) => {
    if (err) {
      console.error("Error adding comment:", err);
      res.status(500).send("Server Error");
    } else {
      res.json({
        id: result.insertId,
        post_id,
        content,
        created_at,
      });
    }
  });
});



router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM comments WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Delete Error:", err);
      res.status(500).send("Server Error");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Comment not found");
    } else {
      res.json({ success: true });
    }
  });
});


router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const updated_at = new Date(); // 수정 시간
  const query = "UPDATE comments SET content = ?, updated_at = ? WHERE id = ?";
  db.query(query, [content, updated_at, id], (err, result) => {
    if (err) {
      console.error("Error updating comment:", err);
      res.status(500).send("Server Error");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Comment not found");
    } else {
      res.json({ success: true, updated_at });
    }
  });
});



module.exports = router;
