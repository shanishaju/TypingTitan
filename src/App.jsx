import React, { useState, useEffect, useRef } from "react";
import { faker } from "@faker-js/faker"; // Import faker
import "./App.css"; 



function App() {
  const gameDuration = 5;
  const [textToType, setTextToType] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [points, setPoints] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const storedHighScore = localStorage.getItem("highScore");
    return storedHighScore ? parseFloat(storedHighScore) : 0;
  });
  const [showCongrats, setShowCongrats] = useState(false);
  const inputRef = useRef(null);




  const generateRandomSentences = () => {
    const sentences = [];
    for (let i = 0; i < 1; i++) {
      let sentence = faker.hacker.phrase();
      // console.log(sentence);
      sentence = sentence.replace(/[^a-zA-Z\s]/g, ""); // Remove special characters
      if (sentence.trim().length > 0) {
        sentences.push(sentence); 
      }
    }
    setTextToType(sentences.join(" "));
  };




  useEffect(() => {
    if (isRunning) {
      inputRef.current.focus();
    }
  }, [isRunning]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      calculateResults();
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    generateRandomSentences();
    setIsRunning(true);
    setUserInput("");
    setTimeLeft(gameDuration);
    setWpm(0);
    setAccuracy(100);
    setPoints(0);
    setShowCongrats(false);

  };

  const handleReset = () => {
    setIsRunning(false);
    setUserInput("");
    setTimeLeft(gameDuration);
    setWpm(0);
    setAccuracy(100);
    setPoints(0);
    setShowCongrats(false);
    inputRef.current.focus();
  };

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const calculateResults = () => {

    const wordsTyped = userInput.trim().split(/\s+/).length;
    const correctChars = userInput.split("").filter((char, index) => char === textToType[index]).length;
    const totalCharsTyped = userInput.length;

    const calculatedWpm = Math.round((wordsTyped / gameDuration) * 60);
    const calculatedAccuracy = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 0;
    const calculatedPoints = (calculatedWpm * (calculatedAccuracy / 100)).toFixed(1);

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    setPoints(calculatedPoints);

    if (calculatedPoints > highScore) {
      localStorage.setItem("highScore", calculatedPoints);
      setHighScore(calculatedPoints);
      setShowCongrats(true);

    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold">Typing Speed Test</h1>
      <p className="mb-4 max-w-2xl text-center">{textToType}</p>
      <textarea
        ref={inputRef}
        value={userInput}
        onChange={handleChange}
        disabled={!isRunning}
        className="border p-2 w-full h-20"
        onPaste={(e) => e.preventDefault()}
      />
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${(timeLeft / gameDuration) * 100}%` }}
        ></div>
      </div>
      <div className="flex gap-4 mt-4">
        <button onClick={isRunning ? handleReset : handleStart} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isRunning ? "Reset" : `Start${timeLeft === 0 ? " Again" : ""}`}
        </button>
        <p>Time Left: {timeLeft}s</p>
      </div>
      {timeLeft === 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-bold">Results</p>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Points: {points}</p>
        </div>
      )}
      <h2>High Score: {highScore}</h2>
      {showCongrats && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-green-700 font-bold">Congratulations! You've set a new high score! 🎉</p>
        </div>
      )}
    </div>
  );
}

export default App;
