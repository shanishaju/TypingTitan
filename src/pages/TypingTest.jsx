import React, { useState, useEffect, useRef } from "react";
import { faker } from "@faker-js/faker"; // Import faker
import useSound from "use-sound"; // Import sound hook
import startSound from "../assets/sounds/start.mp3";
import endSound from "../assets/sounds/end.mp3";
import restartSound from "../assets/sounds/restart.mp3";

function TypingTest() {
    const gameDuration = 30;
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



    // Load sounds
    const [playEnd] = useSound(endSound, { volume: 0.3 });
    const [playStart] = useSound(startSound, { volume: 0.5 });
    const [playRestart] = useSound(restartSound, { volume: 0.5 });


    // generateRandomSentences
    const generateRandomSentences = () => {
        const sentences = [];
        for (let i = 0; i < 5; i++) {
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
        playStart(); // Play start sound
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
        playRestart(); // Play restart sound
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
        playEnd(); // Play end sound

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
        <>
            <div className="app-container flex flex-col md:flex-row items-center justify-center h-screen p-4 gap-6 animate-fade-in pt-20">
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-orange-400 "></div>

                {/* Typing Test Section */}
                <div className="relative w-full md:w-2/3 max-w-2xl bg-orange-300 border-5 border-orange-500 rounded-lg shadow-lg p-6 transition-all duration-500 hover:scale-105">
                    <h1 className="text-white text-3xl md:text-4xl font-bold text-center animate-slide-in">
                        Typing Speed Test
                    </h1>

                    {/* Stats Section */}
                    <div className="grid grid-cols-3 gap-4 text-center mt-5">
                        <div className="w-full bg-gray-200 h-2 rounded-md mt-2">
                            <div
                                className="bg-blue-500 h-2 rounded-md transition-all"
                                style={{ width: `${(timeLeft / gameDuration) * 100}%` }}
                            ></div>
                        </div>

                    </div>

                    {/* Typing Area */}
                    <div className="mt-6">
                        <p className="text-center text-lg font-medium">{textToType}</p>

                        <textarea
                            ref={inputRef}
                            value={userInput}
                            onChange={handleChange}
                            disabled={!isRunning}
                            className="w-full mt-4 p-3 border border-blue-300 rounded-md text-lg resize-none transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            rows="5"
                            placeholder="Start typing here..."
                            onPaste={(e) => e.preventDefault()}
                        ></textarea>

                        {/* Buttons Section */}
                        <div className="flex justify-center mt-4">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md shadow-md transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                                onClick={isRunning ? handleReset : handleStart}

                            >
                                {isRunning ? "Reset" : `Start${timeLeft === 0 ? " Again" : ""}`}
                            </button>
                            <p>Time Left: {timeLeft}s</p>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Section */}
                <div className="relative w-full md:w-1/3 max-w-sm bg-white border-4 border-gray-300 rounded-lg shadow-lg p-6 animate-fade-in delay-200">
                    <h1 className="text-gray-700 text-2xl font-bold text-center mb-4 animate-slide-in">
                        Leaderboard
                    </h1>

                    {/* High Score Section */}
                    <div className="bg-yellow-300 text-gray-800 font-semibold text-center p-3 rounded-lg shadow-md animate-bounce">
                        🏆 High Score: <span className="text-xl font-bold"> {highScore}</span>
                    </div>

                    {/* User's Score */}
                    {timeLeft === 0 && (
                        <div className="mt-4 text-center">
                            <div className="text-blue-500 text-3xl font-bold ">WPM:{wpm}</div>
                            <div className="text-lg font-semibold">Accuracy:{accuracy}%</div>
                            <p className="text-gray-600 text-lg">Your Score:  {points}</p>
                        </div>
                    )}
                    {showCongrats && (
                        <div className="mt-4 p-4 bg-green-100 rounded-lg">
                            <p className="text-green-700 font-bold">Congratulations! You've set a new high score! 🎉</p>
                        </div>
                    )}

                </div>

            </div>


        </>
    )
}

export default TypingTest
