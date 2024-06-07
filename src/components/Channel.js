import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestoreQuery } from '../hooks';
// Components
import Message from './Message';
import 'tailwindcss/tailwind.css';

const Channel = ({ user = null }) => {
  const db = getFirestore();
  const messagesRef = collection(db, 'messages');
  const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(100));
  const messages = useFirestoreQuery(messagesQuery);

  const [newMessage, setNewMessage] = useState('');

  const inputRef = useRef();
  const bottomListRef = useRef();

  const { uid, displayName, photoURL } = user;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleOnChange = e => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = async e => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      try {
        // Add new message in Firestore
        await addDoc(messagesRef, {
          text: trimmedMessage,
          createdAt: serverTimestamp(),
          uid,
          displayName,
          photoURL,
        });
        // Clear input field
        setNewMessage('');
        // Scroll down to the bottom of the list
        bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error adding message: ', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="overflow-auto flex-grow">
        <div className="py-4 w-full mx-auto">
          <div className="border-b dark:border-gray-600 border-gray-200 py-8 mb-4">
            <div className="font-bold text-3xl text-center">
              <p className="mb-1">Welcome to</p>
              <p className="mb-3">Najia's Chat Room!</p>
            </div>
            <p className="text-gray-400 text-center">
              Let that tea spill..
            </p>
          </div>
          <ul>
            {messages
              ?.sort((first, second) =>
                first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
              )
              ?.map(message => (
                <li key={message.id}>
                  <Message {...message} />
                </li>
              ))}
          </ul>
          <div ref={bottomListRef} />
        </div>
      </div>
      <div className="mb-6 mx-4 w-full">
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-row mb-6 bg-gray-200 dark:bg-coolDark-400 rounded-md px-4 py-3 z-10 w-full dark:text-white shadow-md"
        >
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleOnChange}
            placeholder="Type your message here..."
            className="flex-1 bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage}
            className="uppercase font-semibold text-sm tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

Channel.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Channel;
