import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator  } from "firebase/auth";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {connectStorageEmulator, getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCyFHMeMgLltZbqS37Whh5vMlLM2UCllI",
  authDomain: "shorttermmemorization.firebaseapp.com",
  databaseURL: "https://shorttermmemorization.firebaseio.com",
  projectId: "shorttermmemorization",
  storageBucket: "shorttermmemorization.appspot.com",
  messagingSenderId: "440994357739",
  appId: "1:440994357739:web:db860414b9b1b007e479ae",
  measurementId: "G-0KFM767G9X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}

export { auth, db, storage };