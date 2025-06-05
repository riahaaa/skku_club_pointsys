// deduct_points.js
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} = require("firebase/firestore");

const firebaseConfig = require("./firebaseConfig.json");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 설정값
const DEDUCTION_DAYS = 14; // 2주
const DEDUCTION_POINTS = 20; // 차감 포인트

async function deductInactiveUsers() {
  const now = new Date();
  const usersRef = collection(db, "users");
  const userSnapshots = await getDocs(usersRef);

  for (const userDoc of userSnapshots.docs) {
    const userId = userDoc.id;
    const data = userDoc.data();
    const lastUpdated = data.last_updated?.toDate?.() || new Date(0);

    const daysInactive = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
    if (daysInactive >= DEDUCTION_DAYS) {
      const currentPoints = data.points ?? 0;
      const newPoints = Math.max(0, currentPoints - DEDUCTION_POINTS);

      // 포인트 차감
      await updateDoc(doc(db, "users", userId), { points: newPoints });

      // 기록 저장
      await addDoc(collection(db, "users", userId, "history"), {
        type: "자동차감",
        amount: -DEDUCTION_POINTS,
        before: currentPoints,
        after: newPoints,
        description: `${DEDUCTION_DAYS}일 이상 미참여 차감`,
        timestamp: Timestamp.now(),
      });

      console.log(`🧊 ${userId}: ${currentPoints} → ${newPoints} (자동차감)`);
    }
  }

  console.log("✅ 포인트 차감 프로세스 완료");
}

deductInactiveUsers();
