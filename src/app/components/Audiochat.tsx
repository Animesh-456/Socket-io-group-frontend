import React, { ReactHTMLElement, useState, useEffect } from 'react'

const Audiochat = ({ socket, set, voicechatroomId }: any) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
    const [peerConnections, setPeerConnections] = useState<Record<string, RTCPeerConnection>>({});

    useEffect(() => {
        const init = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                setLocalStream(stream);
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };
        init();

        return () => {
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
            Object.values(peerConnections).forEach((pc) => pc.close());
        };
    }, []);

    useEffect(() => {
        if (localStream) {
            socket.on('offer', (senderId: string, offer: RTCSessionDescriptionInit) => {
                const pc = new RTCPeerConnection();
                localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('iceCandidate', senderId, event.candidate);
                    }
                };
                pc.ontrack = (event) => {
                    setRemoteStreams((prevStreams) => ({ ...prevStreams, [senderId]: event.streams[0] }));
                };
                pc.setRemoteDescription(offer).then(() => {
                    pc.createAnswer().then((answer) => {
                        pc.setLocalDescription(answer);
                        socket.emit('answer', senderId, answer);
                    });
                });
                setPeerConnections((prevPCs) => ({ ...prevPCs, [senderId]: pc }));
            });

            socket.on('answer', (senderId: string, answer: RTCSessionDescriptionInit) => {
                const pc = peerConnections[senderId];
                if (pc) {
                    pc.setRemoteDescription(answer);
                }
            });

            socket.on('iceCandidate', (senderId: string, candidate: RTCIceCandidate) => {
                const pc = peerConnections[senderId];
                if (pc) {
                    pc.addIceCandidate(candidate);
                }
            });
        }
    }, [localStream]);

    return (
        <div>
            <h1>Group Voice Call</h1>
            <div>
                <h2>Your Audio</h2>
                {localStream && <audio autoPlay muted data-srcObject={localStream as MediaStream} />}
            </div>
            <div>
                <h2>Remote Audios</h2>
                {Object.entries(remoteStreams).map(([senderId, stream]) => (
                    <audio key={senderId} autoPlay data-srcObject={stream as MediaStream} />
                ))}
            </div>
        </div>
    );
};


export default Audiochat
