import React, { createRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PersonaVideo from '../components/PersonaVideo';
import Captions from '../components/Captions';
import ContentCardDisplay from '../components/ContentCardDisplay';
import {
    disconnect, sendEvent, setVideoDimensions, setMicOn, clearTranscript,
} from '../store/sm/index';
// import Header from '../components/Header';
import {
    disconnectPage, disconnectRoute,
} from '../config';
import TextInput from '../components/TextInput';
import STTFeedback from '../components/STTFeedback';
import { exportTranscriptToDatabase } from '../utils/transcriptExport';

function DPChat({
    className,
}) {
    const {
        connected,
        loading,
        disconnected,
        error,
        micOn,
        transcript, // Added transcript to selector
        // speechState,
    } = useSelector(({ sm }) => ({ ...sm }));
    const dispatch = useDispatch();
    const history = useHistory();

    // Timer state - 3 minute session with 30, 20, and 10 second warnings
    const [, setTimeLeft] = useState(180); // 3 minutes in seconds
    const [showWarning30, setShowWarning30] = useState(false);
    const [showWarning20, setShowWarning20] = useState(false);
    const [showWarning10, setShowWarning10] = useState(false);

    // Ensure mic stays enabled
    useEffect(() => {
        if (connected && !micOn) {
            dispatch(setMicOn({ micOn: true }));
        }
    }, [connected, micOn, dispatch]);

    // Add effect to manage mic based on speech state
    // useEffect(() => {
    //     if (speechState !== 'speaking' && micOn) {
    //         // AI is speaking, mute the mic
    //         dispatch(setMicOn({ micOn: false }));
    //     } else if (speechState === 'speaking' && !micOn) {
    //         // AI finished speaking, unmute the mic
    //         dispatch(setMicOn({ micOn: true }));
    //     }
    // }, [speechState, micOn, dispatch]);

    // Navigation logic
    if (disconnected === true) {
        if (disconnectPage) {
            history.push(disconnectRoute);
        } else history.push('/');
    } else if (error !== null) history.push('/loading?error=true');
    // usually this will be triggered when the user refreshes
    else if (connected !== true) history.push('/');

    // Timer effect - 3 minute session with 30, 20, and 10 second warnings
    useEffect(() => {
        if (!connected) return undefined;
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                const newTime = prevTime - 1;
                // Show warning at 30 seconds (2:30 mark)
                if (newTime === 30 && !showWarning30) {
                    setShowWarning30(true);
                }
                // Show warning at 20 seconds (2:40 mark) and hide 30 second warning
                if (newTime === 20 && !showWarning20) {
                    setShowWarning30(false);
                    setShowWarning20(true);
                }
                // Show warning at 10 seconds (2:50 mark) and hide 20 second warning
                if (newTime === 10 && !showWarning10) {
                    setShowWarning20(false);
                    setShowWarning10(true);
                }
                // Time's up - force complete refresh after feedback
                if (newTime <= 0) {
                    clearInterval(timer);
                    // Export transcript before navigation
                    exportTranscriptToDatabase(transcript)
                        .then(() => {
                            console.log('Transcript exported successfully via timer expiration');
                        })
                        .catch((error2) => {
                            console.error('Failed to export transcript via timer:', error2);
                        })
                        .finally(() => {
                            // Clear all storage and force hard reload to feedback
                            sessionStorage.clear();
                            localStorage.clear();
                            window.location.href = `/feedback?refresh=${Date.now()}`;
                        });
                    return 0;
                }
                return newTime;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [connected, showWarning30, showWarning20, showWarning10, history, transcript]); // Added all warning states as dependencies

    const handleResize = () => {
        if (connected) {
            dispatch(setVideoDimensions({
                videoWidth: window.innerWidth,
                videoHeight: window.innerHeight,
            }));
        }
    };

    const [startedAt] = useState(Date.now());
    const cleanup = () => {
        if (Date.now() - startedAt < 1000) {
            console.warn('cleanup function invoked less than 1 second after component mounted, ignoring!');
        } else {
            console.log('cleanup function invoked!');
            window.removeEventListener('resize', handleResize);
            if (connected === true && loading === false) dispatch(disconnect());
        }
    };

    useEffect(() => {
        // CLEAR SOUL MACHINES SESSION PERSISTENCE DATA for fresh session
        sessionStorage.removeItem('sm-session-id');
        sessionStorage.removeItem('sm-api-key');
        sessionStorage.removeItem('sm-server');
        // Also clear any other SM-related session data that might persist
        Object.keys(sessionStorage).forEach((key) => {
            if (key.startsWith('sm-') || key.startsWith('soul-')) {
                sessionStorage.removeItem(key);
            }
        });
        // send init event, since we will finish loading before we display the DP
        dispatch(sendEvent({ eventName: '', payload: {}, kind: 'init' }));
        // CLEAR TRANSCRIPT at start of new chat session to ensure fresh experience
        dispatch(clearTranscript());
        // ALWAYS enable mic but keep old transcript hidden (our new STTFeedback is always visible)
        dispatch(setMicOn({ micOn: true }));
        // run resize once on mount, then add listener for future resize events
        handleResize();
        window.addEventListener('resize', handleResize);
        // run cleanup on unmount
        return () => cleanup();
    }, []);

    window.onbeforeunload = () => {
        console.log('cleaning up');
        cleanup();
    };

    // content card display is dependent on remaining space between header and footer
    const ccDisplaRef = createRef();
    useEffect(() => {
        // This effect ensures the content card display ref is properly set
        // The height calculation is handled by the ContentCardDisplay component itself
        if (ccDisplaRef.current) {
            // Content cards will auto-size based on available space
        }
    }, [ccDisplaRef]);

    return (
        <div className={className}>
            <div className="chat-overlay">
                {/* Timer Warnings */}
                {showWarning30 && (
                    <div className="timer-warning timer-warning-30">
                        <div className="warning-content">
                            <div className="warning-text">30 Seconds left in this interaction</div>
                        </div>
                    </div>
                )}
                {showWarning20 && (
                    <div className="timer-warning timer-warning-20">
                        <div className="warning-content">
                            <div className="warning-text">20 Seconds left in this interaction</div>
                        </div>
                    </div>
                )}
                {showWarning10 && (
                    <div className="timer-warning timer-warning-10">
                        <div className="warning-content">
                            <div className="warning-text">10 Seconds Left</div>
                            <div className="warning-text">It was great to connect! I'm going to hop on another call.</div>
                        </div>
                    </div>
                )}
                {/* Header */}
                {/* <div className="header-section">
                    <Header />
                </div> */}
                {/* Main Content Area */}
                <div className="main-content" ref={ccDisplaRef}>
                    <div className="content-sidebar">
                        <ContentCardDisplay />
                    </div>
                </div>
                {/* Chat Interface */}
                <div className="chat-interface">
                    {/* Captions - Always visible */}
                    <div className="captions-section">
                        <Captions />
                    </div>
                    {/* STT Feedback - Always visible transcript */}
                    <div className="feedback-section">
                        <STTFeedback />
                    </div>
                    {/* Text Input - Always visible */}
                    <div className="input-section">
                        <TextInput />
                    </div>
                </div>
            </div>
            {/* Video Background */}
            {connected ? <PersonaVideo /> : null}
        </div>
    );
}

DPChat.propTypes = {
    className: PropTypes.string.isRequired,
};

export default styled(DPChat)`
    height: 100vh;
    width: 100vw;
    position: relative;
    overflow: hidden;

    .chat-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        display: flex;
        flex-direction: column;
        pointer-events: none;
    }

    .header-section {
        pointer-events: auto;
        flex-shrink: 0;
        position: relative;
    }

    .timer-warning {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 100;
        pointer-events: none;
        animation: slideInWarning 0.5s ease-out;
    }

    .timer-warning-20 {
        top: 1rem; /* Same position as 30-second warning */
    }

    .timer-warning-10 {
        top: 1rem; /* Same position as other warnings */
        right: 1rem; /* Same position as other warnings */
    }

    @keyframes slideInWarning {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .warning-content {
        background: rgba(34, 197, 94, 0.95); /* Changed to friendly green */
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3); /* Green shadow */
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        animation: pulse 1s ease-in-out infinite alternate;
    }

    .warning-content-large {
        padding: 1.5rem 2rem;
        font-size: 1.1rem;
    }

    @keyframes pulse {
        from {
            box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3); /* Green shadow */
        }
        to {
            box-shadow: 0 8px 25px rgba(34, 197, 94, 0.6); /* Green shadow */
        }
    }

    .warning-text {
        font-size: 1rem;
        font-weight: 700;
        text-align: center;
        white-space: nowrap;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .warning-content-large .warning-text {
        white-space: normal;
        line-height: 1.4;
    }

    .warning-content-large .warning-text:first-child {
        margin-bottom: 0.5rem;
    }

    .timer-warning-10 .warning-text {
        white-space: normal;
        line-height: 1.4;
    }

    .timer-warning-10 .warning-text:first-child {
        margin-bottom: 0.5rem;
    }

    .main-content {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 2rem;
        overflow: hidden;
    }

    .content-sidebar {
        pointer-events: auto;
        max-width: 400px;
        width: 100%;
        @media (max-width: 768px) {
            max-width: 300px;
        }
        @media (max-width: 480px) {
            display: none;
        }
    }

    .chat-interface {
        flex-shrink: 0;
        pointer-events: auto;
        padding: 1rem 2rem 2rem;
        background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.05) 50%,
            transparent 100%
        );
        @media (max-width: 768px) {
            padding: 1rem;
        }
    }

    .captions-section {
        margin-bottom: 1rem;
    }

    .feedback-section {
        margin-bottom: 1rem;
    }

    .input-section {
        /* No margin bottom for last element */
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
        .main-content {
            padding: 0 1rem;
        }
        .chat-interface {
            padding: 0.75rem;
        }
    }

    @media (max-width: 480px) {
        .main-content {
            display: none;
        }
        .chat-interface {
            padding: 1rem 0.75rem;
        }
    }
`;