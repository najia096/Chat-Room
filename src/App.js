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
  apiKey: "AIzaSyCZJ2FWxR-rpqPGkZjopmTu54dfVDJW1QY",
  authDomain: "react-firechat-3e463.firebaseapp.com",
  projectId: "react-firechat-3e463",
  storageBucket: "react-firechat-3e463.appspot.com",
  messagingSenderId: "996014212540",
  appId: "1:996014212540:web:71ab2af41a911c982bd7b9"
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

    // Cleanup subscription
    return () => unsubscribe();
  }, [initializing]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage(); // Correct usage here
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-coolDark-500">
      <header className="py-8">
        <img src={logo} alt="Logo" className="w-32 h-auto" />
      </header>
      <div className="bg-white dark:bg-coolDark-600 rounded-md shadow-md p-8">
        {user ? (
          <>
            <Button onClick={signOut}  className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-purple-400 transition-all">
              Sign Out
            </Button>
            <Channel user={user} db={db} />
          </>
        ) : (
          <Button onClick={signInWithGoogle}>Sign in with Google</Button>
        )}
      </div>
    </div>
  );
}

export default App;
