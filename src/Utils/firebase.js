import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import "firebase/compat/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5JUkIEXDVRw5smruDDmrhL-_NDv7ptsY",
  authDomain: "kiralamaapp.firebaseapp.com",
  projectId: "kiralamaapp",
  storageBucket: "kiralamaapp.appspot.com",
  messagingSenderId: "979554732936",
  appId: "1:979554732936:web:7f9a3aeb42f81ceb5b483d"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
