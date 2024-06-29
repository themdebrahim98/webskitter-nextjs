import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBQqzUaKfF9_2NFR2ULXERkI7mbWLYtUc8",
  authDomain: "webskitter-9197d.firebaseapp.com",
  projectId: "webskitter-9197d",
  storageBucket: "webskitter-9197d.appspot.com",
  messagingSenderId: "608749423707",
  appId: "1:608749423707:web:824a08bf75b8e7cc51037e",
  measurementId: "G-PYKXFM7T1W",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
