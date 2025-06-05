// upload.js
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, getDoc } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");

const firebaseConfig = require("./firebaseConfig.json"); // Firebase 설정 JSON

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// C에서 받은 인자
const [,, user, activity, duration] = process.argv;

async function upload() {
  const userRef = doc(db, "users", user);
  const snapshot = await getDoc(userRef);

  const prevPoints = snapshot.exists() ? snapshot.data().points : 0;
  const additionalPoints = Math.floor(Number(duration) / 10) * 5;

  await setDoc(userRef, {
    user_id: user,
    last_activity: activity,
    last_duration: Number(duration),
    last_updated: new Date(),
    points: prevPoints + additionalPoints,
  });

  console.log(`[🔥 Firebase 업데이트 완료] ${user}: ${prevPoints} → ${prevPoints + additionalPoints}`);
}

upload();
