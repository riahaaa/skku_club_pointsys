// server_combined.js
// C 프로그램 실행 + Firebase 시간표 저장 기능 통합 서버

const express = require('express');
const cors = require('cors'); 
const { execFile } = require('child_process');
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const firebaseConfig = require("./firebaseConfig.json");

const app = express();
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.use(cors());
app.use(express.json());

// 🔹 활동 등록: C 프로그램 실행
app.post('/api/activity', (req, res) => {
  const { user_id, activity, duration } = req.body;

  execFile('C:\\Users\\maria\\datastructure-server\\project_datastructure.exe',
    [user_id, activity, duration],
    (err, stdout) => {
      if (err) {
        console.error("C 프로그램 실행 오류:", err);
        return res.status(500).send("C 프로그램 실행 실패");
      }
      const result = JSON.parse(stdout);
      res.json(result);
    });
});

// 🔹 시간표 저장: Firebase Firestore
app.post('/timetable', async (req, res) => {
  const { id, schedule } = req.body;
  if (!id || !schedule) return res.status(400).send("잘못된 요청");

  try {
    await setDoc(doc(db, "timetables", id), {
      student_id: id,
      schedule,
      last_updated: new Date()
    });
    res.send("✅ 시간표 저장 완료");
  } catch (err) {
    console.error("저장 오류:", err);
    res.status(500).send("❌ 저장 실패");
  }
});

// 🔹 서버 시작
app.listen(3000, () => console.log("🚀 서버 실행 중: http://localhost:3000"));
