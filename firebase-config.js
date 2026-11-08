// =====================================================================
// My Daily — ตั้งค่า Firebase (แก้ไฟล์นี้ไฟล์เดียว ตามคู่มือขั้นที่ 4)
//
// วิธีแก้: ไปที่บรรทัดล่างสุดของไฟล์ ลบคำว่า null
// แล้ววางค่า firebaseConfig ที่คัดลอกจาก Firebase Console แทน เช่น
//
// window.MYDAILY_FIREBASE_CONFIG = {
//   apiKey: "AIza....",
//   authDomain: "mydaily-maytee.firebaseapp.com",
//   projectId: "mydaily-maytee",
//   storageBucket: "mydaily-maytee.firebasestorage.app",
//   messagingSenderId: "1234567890",
//   appId: "1:1234567890:web:abc123"
// };
//
// ค่าเหล่านี้ไม่ใช่รหัสลับ ความปลอดภัยมาจากกฎ Firestore ที่อนุญาตเฉพาะ UID ของคุณ
// ถ้ายังเป็น null แอปจะเก็บข้อมูลในเครื่องอย่างเดียว (ไม่มีปุ่มซิงก์)
// =====================================================================

window.MYDAILY_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBsXbKGmjQQk_4fZnRiB7O_CQiQ_aKROfI",
  authDomain: "mydaily-maytee.firebaseapp.com",
  projectId: "mydaily-maytee",
  storageBucket: "mydaily-maytee.firebasestorage.app",
  messagingSenderId: "658401595268",
  appId: "1:658401595268:web:63607512fc1c13ea1d17d1"
};
