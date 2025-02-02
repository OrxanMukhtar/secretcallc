import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./calculator.css";

function Calculator() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");
  
  const pin = localStorage.getItem("pinCode")

  // const [setPinCode] = useContext(PinContext)

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
          setResult(eval(display));
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

  return (
    <div className="containerDiv">
      <div>
      <div className="displayParentDiv">
        <h1
          style={{ fontSize: `${fontSize}px` }}
          className="displayH1 displayH1First"
        >
          {result}
        </h1>
        <h1 style={{ fontSize: `${fontSize}px` }}
          className="displayH1 m-0">
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
      <button className="btn registrBtn">Registration</button>
    </div>
  );
}

export default Calculator;
