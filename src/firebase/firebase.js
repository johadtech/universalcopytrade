import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyCAOAk2OwV00UUJR0b9t7Q7_zjAW_BYXhk",
   authDomain: "universal-trade-market.firebaseapp.com",
   projectId: "universal-trade-market",
   storageBucket: "universal-trade-market.appspot.com",
   messagingSenderId: "750957883540",
   appId: "1:750957883540:web:f61b464bdb19f093de4481",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDtmNsjSnruKS6ZCs3jwqec0QMqGqGKQWk",
//   authDomain: "finance-v2-e1682.firebaseapp.com",
//   projectId: "finance-v2-e1682",
//   storageBucket: "finance-v2-e1682.appspot.com",
//   messagingSenderId: "133386766551",
//   appId: "1:133386766551:web:e0236afa4a4dc881e20892",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

//export { db, auth };