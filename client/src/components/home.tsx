/**
 * Home page consists of
 * Header "BattelShips game"
 * Enter Your Name Captain
 * Start Align the ships
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const Home = () => {
  const [name, setName] = useState("");
  const navigator = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sessionStorage.setItem("playerName", name);

    socket.emit("new player", name);

    navigator("/board");
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center content-center gap-4 bg-primary w-screen h-screen">
        <h1 className="font-bold text-6xl text-center text-secondary text-wrap">
          Battelships Game
        </h1>
        <p className="p-4 text-center text-secondary text-wrap text-xl">
          Play online with your friends or with random players anywhere on the
          world.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center content-center gap-4 border-secondary p-4 w-full"
        >
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            className="border-secondary bg-primary p-4 border-b-4 text-2xl text-secondary outline-none"
            placeholder="Enter Your Name"
          />
          <input
            type="submit"
            value={
              name
                ? "Start Align the ships Captain!"
                : "Enter Your Name Captain"
            }
            className="border-0 bg-secondary p-4 text-2xl text-primary cursor-pointer"
          />
        </form>
      </div>
    </>
  );
};

export default Home;
