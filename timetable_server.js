// 예: timetable_server.js 또는 같은 파일에 추가해도 됨
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = require("./firebaseConfig.json");
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.post('/timetable', async (req, res) => {
  const { id, schedule } = req.body;
  if (!id || !schedule) return res.status(400).send("잘못된 요청");

  try {
    await setDoc(doc(db, "timetables", id), {
      student_id: id,
      schedule: schedule,
      last_updated: new Date()
    });
    res.send("✅ 시간표 저장 완료");
  } catch (err) {
    console.error("저장 오류:", err);
    res.status(500).send("❌ 저장 실패");
  }
});
