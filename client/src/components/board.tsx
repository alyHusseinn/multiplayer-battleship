import { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const Board = () => {
  const [board, setBoard] = useState(
    Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))
  );
  const [error, setError] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);
  const [shipSize, setShipSize] = useState<number>(5);
  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);
  const [hoveredCells, setHoveredCells] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("align ships result", ({ isAligned, board }) => {
      setBoard(board);
      isAligned ? setShipSize(shipSize - 1) : setError("Not enough space");
    });

    socket.on("player is ready", () => {
      setIsReady(true);
    });

    socket.on(
      "game Started",
      ({ gameId, opponent }: { gameId: string; opponent: string }) => {
        sessionStorage.setItem("gameId", gameId);
        sessionStorage.setItem("opponent", opponent);
      }
    );
  });

  const getAffectedCells = (row: number, col: number): Set<string> => {
    const cells = new Set<string>();
    if (isHorizontal) {
      for (let i = 0; i < shipSize; i++) {
        if (col + i < 10) cells.add(`${row}-${col + i}`);
      }
    } else {
      for (let i = 0; i < shipSize; i++) {
        if (row + i < 10) cells.add(`${row + i}-${col}`);
      }
    }
    return cells;
  };

  const handleAlignShip = (row: number, col: number) => {
    if (isReady) {
      setError("You cannot add more ships; the game is ready");
      return;
    }
    socket.emit("align ships", [row, col]);
  };

  const handleRotateShips = () => {
    socket.emit("rotate ship");
    setIsHorizontal((prev) => !prev);
  };

  const handleStartTheGame = () => {
    socket.emit("start game");
    navigate("/game");
    if (!isReady) {
      setError("You must place your ships before starting the game");
    }
  };

  const handleMouseOver = (row: number, col: number) => {
    const cells = getAffectedCells(row, col);
    setHoveredCells(cells);
  };

  const handleMouseLeave = () => {
    setHoveredCells(new Set());
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 bg-primary w-screen h-screen">
      <h1 className="font-bold text-6xl text-center text-secondary">
        Place Your Ships
      </h1>
      <div className="grid grid-cols-10 grid-rows-10 w-80 h-80 cursor-pointer border-4 border-secondary">
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`w-full h-full border-secondary border-collapse ${
                hoveredCells.has(`${rowIndex}-${cellIndex}`)
                  ? "bg-sec-gray shadow-md shadow-gray-700  duration-300 scale-110"
                  : cell > 0
                  ? "bg-ship"
                  : "bg-primary"
              } `}
              style={{ borderWidth: "1px" }}
              onClick={() => handleAlignShip(rowIndex, cellIndex)}
              onMouseOver={() => handleMouseOver(rowIndex, cellIndex)}
              onMouseLeave={() => handleMouseLeave()}
            />
          ))
        )}
      </div>
      <div className="flex flex-row flex-wrap relative w-80 h-20">
        <button
          className={`absolute top-0 left-0 w-full h-full border-0 bg-secondary p-4 text-2xl text-primary cursor-pointer transition-transform duration-500 ease-in-out hover:scale-110 ${
            isReady ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
          onClick={handleRotateShips}
        >
          Rotate Ship Direction!
        </button>
        <button
          className={`absolute top-0 left-0 w-full h-full border-0 bg-secondary p-4 text-2xl text-primary cursor-pointer transition-transform  duration-500 ease-in-out hover:scale-110 ${
            isReady ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
          onClick={handleStartTheGame}
        >
          Start The Game
        </button>
      </div>

      <p
        className={`bg-ship p-2 text-xl text-primary border-0 rounded-lg text-center m-4 transition-transform duration-500 ease-in-out ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error}
      </p>
    </div>
  );
};

export default Board;
