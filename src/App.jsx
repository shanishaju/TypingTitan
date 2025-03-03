import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TypingTest from "./pages/TypingTest";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game-starts" element={<TypingTest />} />
      </Routes>

    </>
  );
}

export default App;
