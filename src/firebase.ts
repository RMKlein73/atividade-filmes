
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYcTcy6vdRJxLv-I16mTM74Mjq7du2Z_k",
  authDomain: "mobile-atividades.firebaseapp.com",
  projectId: "mobile-atividades",
  storageBucket: "mobile-atividades.firebasestorage.app",
  messagingSenderId: "167920166883",
  appId: "1:167920166883:web:7de01232abc4b399ad62d6",
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);