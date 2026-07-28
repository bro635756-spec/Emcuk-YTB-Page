import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFobHTVqG2dt54QGokkJWDBxBFuFOniYc",
  authDomain: "emcuk-ytb.firebaseapp.com",
  databaseURL: "https://emcuk-ytb-default-rtdb.firebaseio.com",
  projectId: "emcuk-ytb",
  storageBucket: "emcuk-ytb.firebasestorage.app",
  messagingSenderId: "583409310450",
  appId: "1:583409310450:web:b14cf43e280ba87f9c8e6b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const ADMIN_EMAIL = "tvemcuk@gmail.com";
export { db };
