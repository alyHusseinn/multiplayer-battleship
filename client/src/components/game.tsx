import { useEffect, useState } from "react";
import socket from "../socket";
import clsx from "clsx";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const [playerboard, setPlayerboard] = useState(
    Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))
  );
  const [opponentboard, setOpponentboard] = useState(
    Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))
  );
  const [error, setError] = useState<string>("");
  const [isYourTurn, setIsYourTurn] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isYouWin, setIsYouWin] = useState<boolean>(false);

  useEffect(() => {
    socket.emit("player board", sessionStorage.getItem("gameId")?.toString());

    socket.on("player board", ({ board, isYourTurn }) => {
      setPlayerboard(board);
      setIsYourTurn(isYourTurn);
    });

    socket.on("you hitted", ({ cord, result }) => {
      setOpponentboard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[cord[0]][cord[1]] = result ? -2 : -1;
        console.log(newBoard);
        return newBoard;
      });

      setError("");
      setIsYourTurn(false);
    });

    socket.on("opponent hitted", ({ cord, result }) => {
      setPlayerboard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[cord[0]][cord[1]] = result ? -2 : -1;
        console.log(newBoard);
        return newBoard;
      });

      setIsYourTurn(true);
      setError("");
    });

    socket.on("error hitting", (msg) => {
      setError(msg);
    });

    socket.on("game over", ({ name, isYou }) => {
      console.log("game over", name, isYou);
      setIsGameOver(true);
      setIsYouWin(isYou);
    });
  }, []);

  const handleHit = (cord: [number, number]) => {
    socket.emit("hit", { gameId: sessionStorage.getItem("gameId"), cord });
  };

  return (
    <div className="sm:h-screen w-screen flex flex-col items-center justify-center bg-primary relative">
      {isYouWin && <Confetti />}
      <h1 className="text-3xl font-bold text-center bg-secondary text-primary p-4 text-wrap">
        The Game Started with{" "}
        <span className="bg-primary text-secondary p-2 border-0 rounded-md">
          {sessionStorage.getItem("opponent")?.toString()}{" "}
        </span>
      </h1>
      <h1
        className={clsx(
          "text-2xl font-bold text-center m-2 border-secondary border-b-4 rounded-md border-0",
          {
            "bg-ship text-primary": !isYourTurn,
            "bg-primary text-secondary": isYourTurn,
          }
        )}
      >
        {isYourTurn
          ? "Your Turn Captain " + sessionStorage.getItem("playerName") + "!"
          : sessionStorage.getItem("opponent") +
            "'s Turn (Your ships Under Attack :("}
      </h1>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-between items-center my-4">
          <div
            className={clsx(
              "opponentboard  sm:w-1/2 w-70 h-70  flex flex-col gap-4 justify-center items-center transition-all duration-500 rounded-md border-0",
              {
                "bg-secondary": isYourTurn,
                "p-4": isYourTurn,
                "p-2": !isYourTurn,
              }
            )}
          >
            <h1
              className={clsx("text-2xl text-cente", {
                "text-primary": isYourTurn,
                "text-secondary": !isYourTurn,
              })}
            >
              {sessionStorage.getItem("opponent")}'s Board
            </h1>
            <div
              className={clsx(
                "board grid grid-cols-10  border-4 border-collapse transition-all duration-500 border-secondary"
              )}
            >
              {opponentboard.map((row, rowindex) =>
                row.map((cell, cellindex) => (
                  <div
                    id={`${rowindex}-${cellindex}`}
                    className={clsx(
                      "cell w-12 h-12 sm:w-8 sm:h-8 border border-secondary hover:bg-secondary",
                      {
                        "bg-ship": cell > 0,
                        "bg-hit": cell === -2,
                        "bg-not-hit": cell === -1,
                        "bg-primary": cell === 0,
                        "pointer-events-none": !isYourTurn,
                        "cursor-not-allowed": !isYourTurn,
                        "cursor-pointer": isYourTurn,
                      }
                    )}
                    key={`${rowindex}-${cellindex}`}
                    onClick={() => handleHit([rowindex, cellindex])}
                  ></div>
                ))
              )}
            </div>
          </div>
          <div
            className={clsx(
              "playerboard w-full sm:w-1/2 ml-4 flex flex-col gap-4 justify-center items-center rounded-md border-0 transition-all duration-500",
              {
                "bg-secondary": !isYourTurn,
                "p-4": !isYourTurn,
              }
            )}
          >
            <h1
              className={clsx("text-2xl text-center", {
                "text-secondary": isYourTurn,
                "text-primary": !isYourTurn,
              })}
            >
              Your Board
            </h1>
            <div
              className={clsx(
                "board grid grid-cols-10 border-4 border-collapse border-secondary"
              )}
            >
              {playerboard.map((row, rowindex) =>
                row.map((cell, cellindex) => (
                  <div
                    id={`${rowindex}-${cellindex}`}
                    className={clsx(
                      "cell w-12 h-12 sm:w-8 sm:h-8  border border-secondary cursor-not-allowed",
                      {
                        "bg-ship": cell > 0,
                        "bg-hit": cell === -2,
                        "bg-not-hit": cell === -1,
                        "bg-primary": cell === 0,
                      }
                    )}
                    key={`${rowindex}-${cellindex}`}
                  ></div>
                ))
              )}
            </div>
          </div>
        </div>
        <div
          className={`bg-ship p-2 text-xl text-primary border-0 rounded-lg text-center m-4 transition-all duration-500 ease-in-out ${
            error ? "opacity-100" : "opacity-0"
          }`}
        >
          {error}
        </div>
      </div>
      {isGameOver && <GameOver isYouWin={isYouWin} />}
    </div>
  );
};

function GameOver({ isYouWin }: { isYouWin: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col justify-center items-center absolute top-0 left-0 bg-black bg-opacity-50 transition-all duration-700">
      <div className="flex flex-col items-center bg-secondary w-full border-t-4 border-b-4 border-primary p-4">
        <h1
          className={clsx("text-2xl font-bold text-center m-2 text-primary ")}
        >
          {isYouWin ? "You Win!" : "You Lose!"}
        </h1>
        <button
          className="bg-primary font-bold border-0 rounded-md p-4 text-2xl text-secondary cursor-pointer transition-all duration-500 ease-in-out hover:scale-105"
          onClick={() => navigate("/")}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default Game;