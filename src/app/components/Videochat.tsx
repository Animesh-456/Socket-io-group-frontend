import React, { useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';

const Videochat = ({ socket, peer, callto }: any) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const handleCall = useCallback(async () => {
        try {
            peer.ontrack = (event: RTCTrackEvent) => {
                console.log("Receiving remote stream");
                console.log("event listening to ", event.streams[0]);
                setRemoteStream(event.streams[0]);
            };

            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            setLocalStream(localStream);

            localStream.getTracks().forEach(track => {
                console.log("Adding track to peer", track);
                peer.addTrack(track, localStream);
            });

        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    }, [peer]);

    const handleNegotiation = useCallback(async () => {
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socket.emit('call-user', { socketId: callto, offer: offer });
        } catch (error) {
            console.error("Error during negotiation", error);
        }
    }, [peer, socket, callto]);

    useEffect(() => {
        peer.addEventListener("negotiationneeded", handleNegotiation);
        handleCall();

        return () => {
            peer.removeEventListener("negotiationneeded", handleNegotiation);
        };
    }, [peer, handleNegotiation, handleCall]);

    return (
        <div className='bg-gray-900 w-full h-1/4 flex flex-row justify-center items-center gap-2'>
            <div className='h-screen w-1/2'>
                {localStream && (
                    <video
                        className='h-full w-full'
                        autoPlay
                        muted
                        playsInline
                        // Inline styles for fixed dimensions
                        ref={video => {
                            if (video) {
                                video.srcObject = localStream;
                            }
                        }}
                    />
                )}
            </div>
            <div className='h-screen w-1/2'>
                {remoteStream && (
                    <video
                        autoPlay
                        playsInline
                        className='h-full w-ful'// Inline styles for fixed dimensions
                        ref={video => {
                            if (video) {
                                video.srcObject = remoteStream;
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Videochat;
