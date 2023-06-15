import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import  'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyANLG8yExfjZvEvavqTj4JubfNdieVmFss",
  authDomain: "react-chatapp-49eef.firebaseapp.com",
  projectId: "react-chatapp-49eef",
  storageBucket: "react-chatapp-49eef.appspot.com",
  messagingSenderId: "302086222930",
  appId: "1:302086222930:web:191317272e347084059b8b",
  measurementId: "G-78TMWT0PZK"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  
  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  
  return (
    <>
      <button className='sign-in' onClick={signInWithGoogle}>Sign in with Google</button>
      <p className='community__guidelines'>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(50);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL  
    })

    // Set FormValue back to an empty string after sending message
    setFormValue('');

    // Scrolls a user to the bottom to show them the most recent message
    dummy.current.scrollIntoView(true);
  }

  return (
    <>
      <main>  
        
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice"/>

        <button type="submit" disabled={!formValue}>Send</button>

      </form>

    </>
  )

}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={'assets/prof_pic.jpg'} alt='prof-pic' />
        <p>{text}</p>
      </div>
    </>
  )
}

export default App;
