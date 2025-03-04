import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import { Volume2, VolumeX } from "lucide-react"; // Import sound icons
import "../App.css";
import gameloop from "../assets/sounds/game-loop.mp3";
function Home() {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [play, { stop }] = useSound(gameloop, { volume: 0.5, loop: true });

    useEffect(() => {
        if (isPlaying) {
            play();
        }

        //  sound inactive
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stop();
            } else if (isPlaying) {
                play();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            stop();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isPlaying, play, stop]);


    // Toggle Sound
    const toggleSound = () => {
        if (isPlaying) {
            stop();
        } else {
            play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            className="home-container h-screen bg-cover bg-center relative"
            style={{ backgroundImage: "url('https://cdn.dribbble.com/userupload/21899988/file/original-70ead1dfea0a21d9ebbbc5e1d11bb7e5.gif')" }}
        >
            {/* Sound Toggle Button*/}
            <button
                className="absolute top-5 right-5 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition"
                onClick={toggleSound}
            >
                {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>

            <h1 className="absolute top-[50px] left-1/2 -translate-x-1/2 text-3xl md:text-3xl font-bold text-white drop-shadow-lg animate-pulse">
                🔥 Are you ready to set the keyboard on fire? 🔥
            </h1>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <button
                    className="bg-white hover:bg-orange-500  hover:text-white text-orange-500 font-bold px-6 py-3 rounded-md shadow-md transition-transform duration-300 transform hover:scale-110"
                    onClick={() => navigate("/game-starts")}
                >
                    Start Game
                </button>
            </div>
        </div>
    )
}

export default Home
