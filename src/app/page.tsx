"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
//import { useRouter } from 'next/router';
import Chat from "./components/Chat";
import io from 'socket.io-client';
const socket = io('https://socket-io-group-backend.vercel.app/');

function Home() {
  //const router = useRouter();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");


  const [showChat, setShowChat] = useState(false);


  const handlesubmit = () => {

    let user: any = {
      room: room,
      user: username
    }
    socket.emit("join_room", user);
    setShowChat(true)

  }




  return (

    <>

      {!showChat ? (

        <form className="flex flex-col mt-10 pt-12 max-w-sm mx-auto">
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
            <input type="text" value={username} onChange={(event) => {
              setUsername(event.target.value);
            }} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Alex" required />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Room Id</label>
            <input type="text" value={room} onChange={(event) => setRoom(event.target.value)} id="riimid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>

          <button onClick={handlesubmit} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Join</button>
        </form>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </>

  );
}
export default Home;