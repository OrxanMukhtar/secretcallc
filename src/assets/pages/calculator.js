import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./calculator.css";

function Calculator() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");
  const [pin, setPin] = useState("");
  const [checkPin, setCheckPin] = useState("");

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

  const getPinFromDB = useCallback(async () => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("users", "readonly");
        const store = transaction.objectStore("users");
        const request = store.get("registration");

        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.pinCode);
          } else {
            resolve("");
          }
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("error:", error);
      return "";
    }
  }, []);

  useEffect(() => {
    const fetchPin = async () => {
      const storedPin = await getPinFromDB();
      setPin(storedPin);
    };
    fetchPin();
  }, [getPinFromDB]);

  const safeEval = (expression) => {
    try {
      return new Function(`return ${expression}`)();
    } catch (error) {
      return "Error";
    }
  };

  const handleClick = (value) => {
    if (value === "AC") {
      setDisplay("");
      setResult("");
    } else if (value === "< <") {
      setDisplay(display.slice(0, -1));
    } else if (value === "=") {
      try {
        if (display === pin) {
          setResult("ok");
          navigate("/gallery");
        } else {
          setResult(safeEval(display));
        }
      } catch (error) {
        setResult("Error");
      }
    } else {
      setDisplay(display + value);
    }
  };

  const [fontSize, setFontSize] = useState(32);

  useEffect(() => {
    if (display.length > 6) {
      setFontSize(22);
    } else {
      setFontSize(32);
    }
  }, [display]);

  const registrPg = () => {
    navigate("Registration");
  };

  useEffect(() => {
    if (typeof pin === "string") {
      setCheckPin("none");
    } else {
      setCheckPin("block");
    }
  }, [pin]);

  return (
    <div className="containerDiv">
      <div>
        <div className="displayParentDiv">
          <h1 style={{ fontSize: `${fontSize}px` }} className="displayH1 displayH1First">
            {result}
          </h1>
          <h1 style={{ fontSize: `${fontSize}px` }} className="displayH1 m-0">
            {display}
          </h1>
        </div>
        <div className="calcBtns">
          {[
            "AC",
            "< <",
            "/",
            "*",
            "7",
            "8",
            "9",
            "-",
            "4",
            "5",
            "6",
            "+",
            "1",
            "2",
            "3",
            "0",
            ".",
            "=",
          ].map((btn, index) => (
            <button
              key={index}
              className={`btn ${btn === "=" ? "equal" : ""} ${btn === "+" ? "plus" : ""}`}
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
      <button style={{ display: checkPin }} onClick={registrPg} className="btn registrBtn">
        Registration
      </button>
    </div>
  );
}

export default Calculator;
