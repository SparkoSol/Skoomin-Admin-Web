import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARnQHdzpUtBCHxZ4R4Ddxf3nzSQH2Ztqg",
  authDomain: "skoomin-7a039.firebaseapp.com",
  databaseURL: "https://skoomin-7a039.firebaseio.com",
  projectId: "skoomin-7a039",
  storageBucket: "skoomin-7a039.appspot.com",
  messagingSenderId: "30450629726",
  appId: "1:30450629726:web:33d82976a27d8374c588cf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const schools = collection(db, 'school');
const principles = collection(db, 'principle');
const adminAuth = collection(db, 'admin_auth');

export { db, schools, principles, adminAuth };