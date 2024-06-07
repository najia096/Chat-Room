import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Button from './components/Button';
import Channel from './components/Channel';
import Loader from './components/Loader';
import 'tailwindcss/tailwind.css';
import logo from './chat-logo.png';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return () => unsubscribe();
  }, [initializing]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (initializing) return <Loader />;

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100 dark:bg-coolDark-500">
      <header className="py-8">
        <img src={logo} alt="Logo" className="w-32 h-auto" />
      </header>
      <div className="bg-white mb-6 dark:bg-coolDark-600 rounded-md shadow-md p-8 w-full max-w-screen-lg mx-auto" style={{ overflow: 'hidden' }}>
        {user ? (
          <>
            <div className="flex justify-center  mb-8 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105">
              <Button onClick={signOut}>
                Sign Out
              </Button>
            </div>
            <Channel user={user} db={db} />
          </>
        ) : (
          <div className="flex justify-center bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105">
            <Button onClick={signInWithGoogle}>
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
