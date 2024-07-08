import React, { useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Play, X } from "lucide-react";
import Piano from "./Piano";
import { initAudio, playChord, playProgression, playNote } from "./audioUtils";

const ChordBox = ({
  id,
  chord,
  onChordSelect,
  isSelected,
  onRemoveNote,
  onClearChord,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "chord",
    item: { id, chord },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-2 m-1 border rounded ${isDragging ? "opacity-50" : ""} ${
        isSelected ? "bg-blue-200" : "bg-orange-200"
      }`}
      onClick={() => onChordSelect(id)}
    >
      <div className="flex flex-col items-center justify-between mb-2">
        {chord.length > 0 ? (
          chord.map((note, noteIndex) => (
            <span
              key={noteIndex}
              className="mr-1 mb-1 px-1 bg-white rounded flex items-center"
            >
              {note}
              <X
                className="ml-1 w-3 h-3 cursor-pointer text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveNote(id, noteIndex);
                }}
              />
            </span>
          ))
        ) : (
          <span>Empty</span>
        )}
      </div>
      <div className="flex justify-between">
        <button
          className="px-2 py-1 text-xs bg-red-500 text-white rounded"
          onClick={(e) => {
            e.stopPropagation();
            onClearChord(id);
          }}
        >
          Clear
        </button>
        <Play
          className="w-4 h-4 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            playChord(chord);
          }}
        />
      </div>
    </div>
  );
};

const ChordSlot = ({ rowIndex, colIndex, children, moveChord }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "chord",
    drop: (item) => moveChord(item.id, `${rowIndex}-${colIndex}`),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`relative ${isOver ? "bg-green-100" : ""}`}>
      {isOver && (
        <div className="absolute inset-0 border-2 border-green-500 rounded pointer-events-none" />
      )}
      {children}
    </div>
  );
};

const ChordRow = ({
  rowIndex,
  chords,
  beats,
  moveChord,
  onChordSelect,
  selectedChord,
  onRemoveNote,
  onClearChord,
  onBeatsChange,
  bpm,
}) => {
  const handlePlayRowProgression = () => {
    const rowChords = chords.filter((chord) => chord.length > 0); // Remove empty chords
    const chordBeats = beats.filter((_, index) => chords[index].length > 0);

    if (rowChords.length === 0) return; // Don't play if there are no chords

    const beatDuration = 60 / bpm; // Duration of one beat in seconds
    const chordDurations = chordBeats.map((beat) => beat * beatDuration);

    playProgression(rowChords, chordDurations);
  };

  return (
    <div className="flex items-center">
      {chords.map((chord, colIndex) => (
        <ChordSlot
          key={colIndex}
          rowIndex={rowIndex}
          colIndex={colIndex}
          moveChord={moveChord}
          beats={beats[colIndex]}
          onBeatsChange={onBeatsChange}
        >
          <ChordBox
            id={`${rowIndex}-${colIndex}`}
            chord={chord}
            moveChord={moveChord}
            onChordSelect={onChordSelect}
            isSelected={selectedChord === `${rowIndex}-${colIndex}`}
            onRemoveNote={onRemoveNote}
            onClearChord={onClearChord}
          />
        </ChordSlot>
      ))}
      <div className="ml-4">
        <Play
          className="w-6 h-6 cursor-pointer"
          onClick={handlePlayRowProgression}
        />
      </div>
    </div>
  );
};

const BeatSelector = ({ beats, onBeatsChange }) => {
  return (
    <div className="flex mb-2">
      {beats.map((beat, index) => (
        <div key={index} className="flex-1 px-1">
          <input
            type="number"
            min="1"
            max="8"
            value={beat}
            onChange={(e) => onBeatsChange(index, parseInt(e.target.value))}
            className="w-full text-center border rounded"
          />
        </div>
      ))}
      <div className="ml-4 invisible">
        <Play className="w-6 h-6 cursor-pointer" onClick={() => {}} />
      </div>
    </div>
  );
};

const ChordGrid = ({
  grid,
  setGrid,
  beats,
  setBeats,
  selectedChord,
  setSelectedChord,
  bpm,
}) => {
  const moveChord = useCallback(
    (fromId, toId) => {
      const [fromRow, fromCol] = fromId.split("-").map(Number);
      const [toRow, toCol] = toId.split("-").map(Number);

      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.map((chord) => [...chord]));
        // Swap the chords
        const temp = newGrid[fromRow][fromCol];
        newGrid[fromRow][fromCol] = newGrid[toRow][toCol];
        newGrid[toRow][toCol] = temp;
        return newGrid;
      });
    },
    [setGrid]
  );

  const handleRemoveNote = useCallback(
    (chordId, noteIndex) => {
      const [rowIndex, colIndex] = chordId.split("-").map(Number);
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        const newChord = [...newGrid[rowIndex][colIndex]];
        newChord.splice(noteIndex, 1);
        newGrid[rowIndex][colIndex] = newChord;
        return newGrid;
      });
    },
    [setGrid]
  );

  const handleClearChord = useCallback(
    (chordId) => {
      const [rowIndex, colIndex] = chordId.split("-").map(Number);
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[rowIndex][colIndex] = [];
        return newGrid;
      });
    },
    [setGrid]
  );

  const handleBeatsChange = useCallback(
    (colIndex, newBeats) => {
      setBeats((prevBeats) => {
        const newBeatsArray = [...prevBeats];
        newBeatsArray[colIndex] = newBeats;
        return newBeatsArray;
      });
    },
    [setBeats]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <BeatSelector beats={beats} onBeatsChange={handleBeatsChange} />
        {grid.map((row, rowIndex) => (
          <ChordRow
            key={rowIndex}
            rowIndex={rowIndex}
            chords={row}
            beats={beats}
            moveChord={moveChord}
            onChordSelect={setSelectedChord}
            selectedChord={selectedChord}
            onRemoveNote={handleRemoveNote}
            onClearChord={handleClearChord}
            onBeatsChange={handleBeatsChange}
            bpm={bpm}
          />
        ))}
      </div>
    </DndProvider>
  );
};

const ChordAuditionTool = () => {
  const [grid, setGrid] = useState(
    Array(5)
      .fill()
      .map(() => Array(12).fill([]))
  );
  const [beats, setBeats] = useState(Array(12).fill(4));
  const [selectedChord, setSelectedChord] = useState(null);
  const [bpm, setBpm] = useState(120);

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await initAudio();
        console.log("Audio initialized successfully");
      } catch (error) {
        console.error("Failed to initialize audio:", error);
      }
    };

    const handleFirstInteraction = async () => {
      console.log("First interaction detected");
      await initializeAudio();
      document.removeEventListener("click", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
    };
  }, []);

  const handleKeyPress = useCallback(
    (note) => {
      console.log("Key pressed:", note);
      playNote(note); // Always play the note when pressed

      if (selectedChord) {
        const [rowIndex, colIndex] = selectedChord.split("-").map(Number);
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((row) => row.map((chord) => [...chord])); // Create a deep copy
          const currentChord = newGrid[rowIndex][colIndex];
          const noteIndex = currentChord.indexOf(note);

          if (noteIndex === -1) {
            // Add the note if it's not in the chord
            currentChord.push(note);
          } else {
            // Remove the note if it's already in the chord
            currentChord.splice(noteIndex, 1);
          }

          console.log("Updated chord:", currentChord);
          return newGrid;
        });
      }
    },
    [selectedChord]
  );

  const getActiveNotes = () => {
    if (selectedChord) {
      const [rowIndex, colIndex] = selectedChord.split("-").map(Number);
      return grid[rowIndex][colIndex];
    }
    return [];
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chord Audition Tool</h1>

      <div className="flex flex-col items-center">
        <div className="mb-4">
          <label htmlFor="bpm" className="mr-2">
            BPM:
          </label>
          <input
            id="bpm"
            type="number"
            min="40"
            max="240"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-16 text-center border rounded"
          />
        </div>
        <Piano onKeyPress={handleKeyPress} activeNotes={getActiveNotes()} />
        <ChordGrid
          grid={grid}
          setGrid={setGrid}
          beats={beats}
          setBeats={setBeats}
          selectedChord={selectedChord}
          setSelectedChord={setSelectedChord}
          bpm={bpm}
        />
      </div>
    </div>
  );
};

export default ChordAuditionTool;
