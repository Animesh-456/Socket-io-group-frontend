"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
//import { useRouter } from 'next/router';
import Chat from "./components/Chat";
import TalkEaseAnimation from './TalkEaseAnimation.gif'
import io from 'socket.io-client';
//const socket = io('http://localhost:3001');

const socket = io('https://socket-io-group-backend.onrender.com');
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


      {/* <div className="flex flex-col justify-center items-center mt-12 md:flex-row"> */}

      <div >
        <div>
          {!showChat ? (

            <>

              <div className="flex flex-col md:flex-row mt-12">
                <div className="flex flex-col w-full justify-end items-center">
                  <div>
                    <p className="fade-in-zoom" style={{ fontSize: "35px", fontWeight: "bolder" }}>
                      Welcome to <span className="gradient-text">T</span>alk<span className="gradient-text">E</span>ase
                    </p>
                  </div>
                  <div>

                    <p className="fade-in-zoom" style={{ fontSize: "20px", animationDelay: '0.2s' }}>
                      Connect and Communicate with Ease
                    </p>
                  </div>

                  <div>
                    <Image src={TalkEaseAnimation} alt="TalkEaseAnimation" />
                  </div>

                </div>
                <div className="w-full">
                  <form className="flex flex-col mt-10 pt-12 max-w-sm mx-auto">
                    <div className="mb-5 mt-10">
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
                </div>
              </div>
            </>
          ) : (
            <Chat socket={socket} username={username} room={room} />
          )}
        </div>

      </div>

      {/* </div> */}

    </>

  );
}
export default Home;





