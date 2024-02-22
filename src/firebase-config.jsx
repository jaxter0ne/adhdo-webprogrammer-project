import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAEFnGOs9p3EF9SnACAYEuJDREyR8yy9hg",
  authDomain: "adhdo-project.firebaseapp.com",
  databaseURL: "https://adhdo-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "adhdo-project",
  storageBucket: "adhdo-project.appspot.com",
  messagingSenderId: "39776408842",
  appId: "1:39776408842:web:b56e7459f689dce5e456f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };