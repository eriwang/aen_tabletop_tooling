import React from 'react';
import firebase from 'firebase/compat/app';
import logo from './logo.svg';
import './App.css';

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyCd2eL7UFFBQWVfizJZEVdD-3aP2IXPCRk",
    authDomain: "combat-tracker-3dd9d.firebaseapp.com",
    databaseURL: "https://combat-tracker-3dd9d-default-rtdb.firebaseio.com",
    projectId: "combat-tracker-3dd9d",
    storageBucket: "combat-tracker-3dd9d.appspot.com",
    messagingSenderId: "726783880260",
    appId: "1:726783880260:web:b28665ec1453987377a011",
    measurementId: "G-M9N1151GBT"
  };
  firebase.initializeApp(firebaseConfig);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
