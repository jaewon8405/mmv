const express = require("express");
const db = require("../config/db");

const router = express.Router();

// 게시글 목록 가져오기
router.get("/", (req, res) => {
  const { category } = req.query;
  const query = "SELECT * FROM inquiries WHERE category = ?";
  db.query(query, [category], (err, results) => {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      res.json(results);
    }
  });
});

// 특정 게시글 가져오기
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM inquiries WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      res.json(result[0]);
    }
  });
});

// 게시글 추가
router.post("/", (req, res) => {
  const { category, title, content } = req.body;
  const query = "INSERT INTO inquiries (category, title, content) VALUES (?, ?, ?)";
  db.query(query, [category, title, content], (err, result) => {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      res.json({ id: result.insertId });
    }
  });
});

router.patch("/:id/views", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE inquiries SET views = views + 1 WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      res.send({ success: true });
    }
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params; // URL에서 id 가져오기
  const { title, content } = req.body; // 요청 본문에서 데이터 가져오기
  const query = "UPDATE inquiries SET title = ?, content = ? WHERE id = ?";
  db.query(query, [title, content, id], (err, result) => {
    if (err) {
      console.error("Update Error:", err);
      res.status(500).send("Server Error");
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send("Inquiry not found"); // id에 해당하는 데이터가 없을 경우
      } else {
        res.json({ success: true });
      }
    }
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params; // URL에서 id 가져오기
  const query = "DELETE FROM inquiries WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Delete Error:", err);
      res.status(500).send("Server Error");
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send("Inquiry not found"); // id에 해당하는 데이터가 없을 경우
      } else {
        res.json({ success: true });
      }
    }
  });
});


module.exports = router;
