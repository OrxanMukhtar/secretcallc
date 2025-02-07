import React, { useState } from "react";
import {useNavigate } from 'react-router-dom';
import './registration.css';

function Registration() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pinCode, setPinCode] = useState('');

  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("RegistrationDB", 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  const saveRegistrationData = async (data) => {
    try {
      const db = await openDB();
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");
      store.put(data);

      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error( error);
    }
  };

  const registerUser = async (event) => {
    event.preventDefault();

    const data = {
      id: "registration",
      userName,
      email,
      password,
      pinCode
    };

    try {
      await saveRegistrationData(data);
    //   console.log("ok");
    } catch (error) {
      console.error(error);
    }
  };
    const navigate = useNavigate();
  
  
    
  const homePg = () => {
    navigate("/")
  }




  return (
    <div>
      <h1>Registration</h1>
      <form className="regForm" onSubmit={registerUser}>
        <input
          type="text"
          value={userName}
          placeholder="User Name"
          required
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          type="email"
          value={email}
          placeholder="e-mail"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          value={password}
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          value={pinCode}
          placeholder="Pin Code"
          required
          onChange={(e) => setPinCode(e.target.value)}
        />

        <button onClick={homePg} type="submit" className="galleryBtnColor regBtn btn">Done</button>
      </form>
    </div>
  );
}

export default Registration;
