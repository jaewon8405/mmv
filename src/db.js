import initSqlJs from "sql.js";

let db = null;

export const initializeDatabase = async () => {

  if (db) return db; // 이미 초기화된 경우 반환

  try {
    const SQL = await initSqlJs({
      locateFile: (file) => `/sql-wasm.wasm`,
    });

    const dbFile = localStorage.getItem("sqlite-db");
    db = dbFile
      ? new SQL.Database(new Uint8Array(JSON.parse(dbFile))) // 저장된 데이터베이스 로드
      : new SQL.Database(); // 새 데이터베이스 생성

    db.run(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        title TEXT,
        content TEXT,
        createdAt TEXT,
        views INTEGER
      );
    `);
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    alert("데이터베이스 초기화 중 문제가 발생했습니다. 다시 시도해주세요.");
    throw error;
  }
};


// 데이터베이스를 localStorage에 저장하는 함수
const saveDatabase = () => {
  if (db) {
    const data = db.export();
    localStorage.setItem("sqlite-db", JSON.stringify(Array.from(data)));
  }
};



// 데이터 삽입 함수
export const addInquiry = async (category, title, content) => {
  if (!db) {
    await initializeDatabase();
  }

  const createdAt = new Date().toISOString();
  try {
    db.run(
      `INSERT INTO inquiries (category, title, content, createdAt, views)
       VALUES (?, ?, ?, ?, ?)`,
      [category, title, content, createdAt, 0]
    );
    saveDatabase(); // 데이터 저장
    console.log("Data inserted:", { category, title, content, createdAt });
  } catch (error) {
    console.error("Error adding inquiry to database:", error);
    throw error;
  }
};


// 데이터 조회 함수
export const getInquiries = async (category) => {
  if (!db) {
    await initializeDatabase(); // 데이터베이스 초기화
  }

  const stmt = db.prepare(`
    SELECT * FROM inquiries WHERE category = ?
  `);
  const inquiries = [];

  while (stmt.step()) {
    inquiries.push(stmt.getAsObject());
  }

  stmt.free(); // 메모리 해제
  console.log("Retrieved inquiries:", inquiries); // 디버깅 로그
  return inquiries;
};

// 데이터 수정 함수
export const updateInquiry = (id, title, content) => {
  if (!db) {
    console.error("Database is not initialized");
    return;
  }

  db.run(
    `UPDATE inquiries
     SET title = ?, content = ?
     WHERE id = ?`,
    [title, content, id]
  );
  saveDatabase();
};

// 데이터 삭제 함수
export const deleteInquiry = (id) => {
  if (!db) {
    console.error("Database is not initialized");
    return;
  }

  db.run(
    `DELETE FROM inquiries WHERE id = ?`,
    [id]
  );
  saveDatabase();
};

export const incrementViews = async (id) => {
  db.run(`
    UPDATE inquiries SET views = views + 1 WHERE id = ?
  `, [id]);
};

// 카테고리별 게시글 수 계산 함수 추가
export const getCategoryCounts = async () => {
  const stmt = db.prepare(`
    SELECT category, COUNT(*) as count FROM inquiries GROUP BY category
  `);
  const counts = {};
  while (stmt.step()) {
    const row = stmt.getAsObject();
    counts[row.category] = row.count;
  }
  stmt.free();
  return counts;
};

export const getAllInquiries = () => {
  if (!db) {
    console.error("Database is not initialized");
    return [];
  }

  const stmt = db.prepare(`
    SELECT * FROM inquiries
  `);
  const inquiries = [];

  while (stmt.step()) {
    inquiries.push(stmt.getAsObject());
  }

  stmt.free();
  console.log("All inquiries:", inquiries); // 모든 데이터 확인
  return inquiries;
};
