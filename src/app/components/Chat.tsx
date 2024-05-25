import React, { ReactHTMLElement, useState, useEffect, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic';
import ReactPlayer from 'react-player';
import Videochat from './Videochat';
const EmojiPickerComponent = dynamic(() => import('emoji-picker-react'), {
    ssr: false
});

const Chat = ({ socket, username, room }: any) => {


    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"
                ]
            }
        ]
    }), []);


    const createOffer = async (socketId: any) => {

    }


    const [currentMessage, setCurrentMessage]: any = useState("");
    const [messageList, setMessageList]: any = useState([]);
    const [userjoin, setuserjoin]: any = useState([]);
    const [incomingOffer, setIncomingOffer]: any = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [incomingCallState, setincomingCallState] = useState(false)
    const [callingUsername, setcallingUsername] = useState("");
    const [videostate, setvideostate] = useState(false)
    const [callto, setcallto] = useState(null);


    const handlePicker = () => {
        setShowPicker(!showPicker)
    }

    //const [message, setMessage] = useState("");

    const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === 'Enter' && e.nativeEvent.shiftKey) {
            // Append a newline character to the current message
            setCurrentMessage((prevMessage: any) => prevMessage + '\n');
        } else {
            setCurrentMessage(e.target.value);
        }
    }


    console.log("message text", currentMessage)


    // Send message 



    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list: any) => [...list, messageData]);
            setCurrentMessage("");
        }
    };



    useEffect(() => {
        const handleUserJoin = (data: any) => {
            setuserjoin((list: any) => [...list, data]);
        };

        const handleReceiveMessage = (data: any) => {
            setMessageList((list: any) => [...list, data]);
        };

        const handleuserLeft = (data: any) => {
            const updatedItems: any = userjoin.filter((item: any, index: any) => item.socketId !== data.socketId);
            // Update the state with the new array
            setuserjoin(updatedItems);
        }

        const handleIncomingcall = async (data: any) => {
            await setIncomingOffer(data.offer)
            await setcallingUsername(data.from)
            await setincomingCallState(true)

        }


        const hndlecallAccepted = async (data: any) => {
            console.log("the accept cal answer is", data.answer)
            await peer.setRemoteDescription(data.answer)
            setincomingCallState(false)
            console.log(" Call got accepted")
            setvideostate(true)

        }


        // Register event listeners
        socket.on("user_join", handleUserJoin);
        socket.on("receive_message", handleReceiveMessage);
        socket.on("user_left", handleuserLeft)
        socket.on("incoming-call", handleIncomingcall)
        socket.on("call-accepted", hndlecallAccepted)




        // Cleanup function
        return () => {
            // Remove event listeners
            socket.off("user_join", handleUserJoin);
            socket.off("receive_message", handleReceiveMessage);
            socket.off("user_left", handleuserLeft);
            socket.off("incoming-call", handleIncomingcall);
            socket.off("call-accepted", hndlecallAccepted)
        };
    }, [socket, messageList]);


    const handleEmojiInsertion = (emoji: string) => {

        setCurrentMessage(currentMessage + " " + emoji)

    };


    const [file, setFile] = useState<FileList | null>(null);


    const handleFilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files)
    }




    const handleLeaveChat = async () => {
        await socket.emit("leave_room", { room: room });
        window.location.reload()
    }




    const handleAudiocall = async (socketId: any) => {

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        await socket.emit('call-user', { socketId: socketId, offer: offer })
        setcallto(socketId)

    }


    const handlecreateAnswer = async (offer: any) => {
        await peer.setRemoteDescription(incomingOffer)

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer)

        await socket.emit("call-accepted", { socketId: offer, answer: answer })

        setincomingCallState(false)
        setvideostate(true)
    }

    console.log("users in room", userjoin)



    const handleKeyDown = async (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent default action for Enter key (e.g., form submission)
            try {
                sendMessage()
            } catch (error) {
                console.error('Error during API call', error);
            }
        }
    };

    const messageListRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messageListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);



    return (
        <>

            <div className='flex flex-row'>
                <div className='bg-gray-900 w-1/4 h-screen border-2 border-gray-700'>

                    <div className='flex flex-col space-y-5 items-center m-5 p-5'>

                        {userjoin.length ? userjoin?.map((u: any) => {
                            return (
                                <>
                                    <div className='flex flex-row space-x-5 items-center'>
                                        <div className='text-white font-bold py-2 px-4'>{u?.user}</div>
                                        <div className='flex flex-row space-x-5'>
                                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded" onClick={() => handleAudiocall(u?.socketId)}>

                                                <div className='flex flex-row space-x-5'>
                                                    <div>Call</div>
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                        </svg>
                                                    </div>

                                                </div>

                                            </button>
                                        </div>
                                    </div>
                                </>
                            )
                        }) : (<></>)}

                    </div>
                </div>
                <div className='m-0 p-0 w-screen bg-gray-800'>

                    <div className="container mx-auto flex flex-col h-screen m-0 p-0 overflow-auto">


                        {videostate && (
                            <div className='bg-gray-900 w-full h-1/2 flex flex-row gap-2'>
                                <Videochat peer={peer} socket={socket} callto={callto} />
                            </div>
                        )}

                        <div className='flex flex-row justify-between h-1/6 items-center px-8 bg-gray-800 border-2 border-gray-700'>
                            <div className='flex font-bold text-lg'><h1>Room Number : - {room}</h1></div>
                            <div className='flex flex-row justify-between gap-5 items-center'>

                                <div><button onClick={handleLeaveChat} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded">
                                    Leave Chat
                                </button></div>
                            </div>
                        </div>





                        <div className="flex-grow overflow-y-auto px-6 py-4">

                            <div className="flex flex-col space-y-2">

                                {messageList.map((messageContent: any) => {
                                    return (
                                        <>

                                            <div ref={messageListRef} className={`flex items-center ${messageContent?.author === username ? "justify-end" : "justify-start"} `}>
                                                <div className="flex items-start gap-2.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="flex flex-col gap-1 w-full max-w-[320px]">
                                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{messageContent?.author}</span>
                                                            <span className={`text-sm font-normal text-gray-500 dark:text-gray-400`}>{messageContent?.time}</span>
                                                        </div>
                                                        <div className={`lex flex-col leading-1.5 p-4   rounded-e-xl rounded-es-xl ${messageContent?.author === username ? "dark:bg-blue-700" : "dark:bg-gray-700"} `}>
                                                            <pre className="text-sm font-sans text-gray-900 dark:text-white" style={{ overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                                                                {messageContent?.message}
                                                            </pre>


                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </>
                                    );
                                })}



                                <div id="popup-modal" tabIndex={-1} className={` ${!incomingCallState ? "hidden" : ""} overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center`}>
                                    <div className="relative p-4 w-full max-w-md max-h-full flex flex-col">
                                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 flex-1" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                            <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                            <div className="p-4 md:p-5 text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                                </svg>

                                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Incoming call from {callingUsername}</h3>
                                                <button onClick={() => handlecreateAnswer(callingUsername)} data-modal-hide="popup-modal" type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                                    Accept
                                                </button>

                                                <button onClick={() => setincomingCallState(false)} data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center text-center">
                                                    Decline
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </div>










                            </div>


                        </div>






                        <div className="flex items-center px-4 py-4 gap-2">


                            {/* <input onKeyDown={handleKeyDown} type="text" id="input-field" value={currentMessage} onChange={handleMessage} placeholder="Type your message..." className="flex-grow border-gray-300 text-black border-2 rounded-full py-2 px-4 mr-2 focus:outline-none focus:border-blue-500" /> */}


                            <textarea
                                id="input-field"
                                value={currentMessage}
                                onChange={handleMessage}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="bg-gray-900 flex-grow border-gray-700 text-white border-2 rounded-full py-2 px-4 mr-2 focus:outline-none focus:border-white"
                                rows={1} // Adjust the number of rows as needed
                                style={{ width: '100%', resize: 'none' }} // Adjust the width and disable resize if needed
                            />



                            <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                </svg>
                            </button>

                            {/* Message send button */}
                            <button className="bg-green-500 text-white px-4 py-2 rounded-full" onClick={sendMessage}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>

                            </button>

                            <button className="bg-gray-500 text-white px-4 py-2 rounded-full">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center cursor-pointer">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                            </svg>

                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFilechange} />
                                    </label>
                                </div>

                            </button>




                            <button className="bg-gray-500 text-white px-4 py-2 rounded-full" onClick={handlePicker}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                </svg>
                            </button>


                        </div>

                        <div className={`${showPicker ? 'opacity-100' : 'opacity-0'} ${showPicker ? 'block' : 'hidden'}`}>
                            <div className="flex items-center px-4 py-2 gap-2">
                                <>
                                    <EmojiPickerComponent onEmojiClick={(data) => handleEmojiInsertion(data.emoji)} width={1200} />

                                </>
                            </div>
                        </div>

                    </div>

                </div>

            </div>



        </>

    )
}

export default Chat
