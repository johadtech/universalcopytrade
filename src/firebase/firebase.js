import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
   projectId: process.env.REACT_APP_PROJECTID,
   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
   appId: process.env.REACT_APP_APP_ID,
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