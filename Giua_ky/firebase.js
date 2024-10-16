// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "productmanagement-fea17.firebaseapp.com",
    databaseURL: "https://productmanagement-fea17-default-rtdb.firebaseio.com",
    projectId: "productmanagement-fea17",
    storageBucket: "productmanagement-fea17.appspot.com",
    messagingSenderId: "246834564903",
    appId: "1:246834564903:web:7584e31112a442de2ce302"
};


const app = initializeApp(firebaseConfig);


const db = getDatabase(app);

export { db };
