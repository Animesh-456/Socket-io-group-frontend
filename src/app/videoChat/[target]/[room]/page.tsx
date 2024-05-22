import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../../hooks/useSocket';

const Page: React.FC = () => {
    const router = useRouter();
    const { target, room } = router.query as { target: string; room: string };
    // const socket = useSocket();

    // const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    // const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    // const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    // const [isCallIncoming, setIsCallIncoming] = useState<boolean>(false);
    // const [incomingCallFrom, setIncomingCallFrom] = useState<string | null>(null);

    // const localVideoRef = useRef<HTMLVideoElement>(null);
    // const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // useEffect(() => {
    //     socket.on('incomingCall', (data: { from: string }) => {
    //         setIsCallIncoming(true);
    //         setIncomingCallFrom(data.from);
    //     });

    //     socket.on('callAccepted', async (data: { from: string }) => {
    //         if (!peerConnection) return;
    //         const offer = await peerConnection.createOffer();
    //         await peerConnection.setLocalDescription(offer);
    //         socket.emit('offer', { to: data.from, offer });
    //     });

    //     socket.on('offer', async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
    //         if (!peerConnection || peerConnection.signalingState !== 'stable') return;
    //         await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    //         const answer = await peerConnection.createAnswer();
    //         await peerConnection.setLocalDescription(answer);
    //         socket.emit('answer', { to: data.from, answer });
    //     });

    //     socket.on('answer', async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
    //         if (!peerConnection) return;
    //         await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    //     });

    //     socket.on('candidate', async (data: { from: string; candidate: RTCIceCandidateInit }) => {
    //         if (!peerConnection) return;
    //         try {
    //             await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    //         } catch (e) {
    //             console.error('Error adding received ice candidate', e);
    //         }
    //     });

    //     return () => {
    //         socket.off('incomingCall');
    //         socket.off('callAccepted');
    //         socket.off('offer');
    //         socket.off('answer');
    //         socket.off('candidate');
    //     };
    // }, [peerConnection, socket]);

    // useEffect(() => {
    //     if (localVideoRef.current && localStream) {
    //         localVideoRef.current.srcObject = localStream;
    //     }
    // }, [localStream]);

    // useEffect(() => {
    //     if (remoteVideoRef.current && remoteStream) {
    //         remoteVideoRef.current.srcObject = remoteStream;
    //     }
    // }, [remoteStream]);

    // useEffect(() => {
    //     if (target) {
    //         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //             .then(stream => {
    //                 setLocalStream(stream);
    //                 const pc = new RTCPeerConnection();

    //                 stream.getTracks().forEach(track => {
    //                     pc.addTrack(track, stream);
    //                 });

    //                 pc.ontrack = event => {
    //                     if (event.streams[0]) {
    //                         setRemoteStream(event.streams[0]);
    //                     }
    //                 };

    //                 pc.onicecandidate = event => {
    //                     if (event.candidate) {
    //                         socket.emit('candidate', { to: incomingCallFrom || target, candidate: event.candidate });
    //                     }
    //                 };

    //                 setPeerConnection(pc);
    //             })
    //             .catch(err => {
    //                 console.error('Error accessing media devices.', err);
    //             });
    //     }
    // }, [target, socket, incomingCallFrom]);

    // const initiateCall = () => {
    //     socket.emit('initiateCall', { target, room });
    // };

    // const acceptCall = async () => {
    //     setIsCallIncoming(false);
    //     socket.emit('acceptCall', { to: incomingCallFrom });
    // };

    return (
        <div>
            <h1>Video Call</h1>
            <p>{target}</p>
            <p>{room}</p>
            {/* <div>
                <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }}></video>
                <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }}></video>
            </div>
            {isCallIncoming ? (
                <div>
                    <p>Incoming call...</p>
                    <button onClick={acceptCall}>Accept Call</button>
                </div>
            ) : (
                <div>
                    <button onClick={initiateCall}>Initiate Call</button>
                </div>
            )} */}
        </div>
    );
};

export default Page;
