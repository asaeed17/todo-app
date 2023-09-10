import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
export const db = getFirestore(); //firestore database