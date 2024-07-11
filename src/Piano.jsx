import React from "react";

const PianoKey = ({ note, isSharp, onKeyPress, isActive }) => {
  const keyClass = isSharp
    ? `text-white w-6 h-24 -mx-3 z-10 ${isActive ? "bg-blue-500" : "bg-black"}`
    : ` border border-black w-10 h-36 ${isActive ? "bg-blue-200" : "bg-white"}`;

  return (
    <button className={`${keyClass} relative`} onClick={() => onKeyPress(note)}>
      <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs">
        {note}
      </span>
    </button>
  );
};

const Piano = ({ onKeyPress, activeNotes }) => {
  const keys = [
    { note: "C2", isSharp: false },
    { note: "C#2", isSharp: true },
    { note: "D2", isSharp: false },
    { note: "D#2", isSharp: true },
    { note: "E2", isSharp: false },
    { note: "F2", isSharp: false },
    { note: "F#2", isSharp: true },
    { note: "G2", isSharp: false },
    { note: "G#2", isSharp: true },
    { note: "A2", isSharp: false },
    { note: "A#2", isSharp: true },
    { note: "B2", isSharp: false },
    { note: "C3", isSharp: false },
    { note: "C#3", isSharp: true },
    { note: "D3", isSharp: false },
    { note: "D#3", isSharp: true },
    { note: "E3", isSharp: false },
    { note: "F3", isSharp: false },
    { note: "F#3", isSharp: true },
    { note: "G3", isSharp: false },
    { note: "G#3", isSharp: true },
    { note: "A3", isSharp: false },
    { note: "A#3", isSharp: true },
    { note: "B3", isSharp: false },
    { note: "C4", isSharp: false },
    { note: "C#4", isSharp: true },
    { note: "D4", isSharp: false },
    { note: "D#4", isSharp: true },
    { note: "E4", isSharp: false },
    { note: "F4", isSharp: false },
    { note: "F#4", isSharp: true },
    { note: "G4", isSharp: false },
    { note: "G#4", isSharp: true },
    { note: "A4", isSharp: false },
    { note: "A#4", isSharp: true },
    { note: "B4", isSharp: false },
    { note: "C5", isSharp: false },
    { note: "C#5", isSharp: true },
    { note: "D5", isSharp: false },
    { note: "D#5", isSharp: true },
    { note: "E5", isSharp: false },
    { note: "F5", isSharp: false },
    { note: "F#5", isSharp: true },
    { note: "G5", isSharp: false },
    { note: "G#5", isSharp: true },
    { note: "A5", isSharp: false },
    { note: "A#5", isSharp: true },
    { note: "B5", isSharp: false },
    { note: "C6", isSharp: false },
  ];

  return (
    <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg shadow-lg overflow-x-auto">
      <div className="flex relative">
        {keys.map((key, index) => (
          <PianoKey
            key={index}
            note={key.note}
            isSharp={key.isSharp}
            onKeyPress={onKeyPress}
            isActive={activeNotes.includes(key.note)}
          />
        ))}
      </div>
    </div>
  );
};

export default Piano;
