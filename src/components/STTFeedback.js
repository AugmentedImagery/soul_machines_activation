import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { exportTranscriptToDatabase } from '../utils/transcriptExport';

function STTFeedback({ className }) {
  const {
    transcript,
  } = useSelector(({ sm }) => ({ ...sm }));

  // Get recent transcript entries (text only) - show more messages
  // Filter out system messages and metadata that aren't actual conversation
  const transcriptOnlyText = transcript.filter((t) => {
    // Only include entries with actual text content
    if (!('text' in t) || !t.text) return false;

    // Filter out system/metadata messages
    const systemKeywords = [
      'PAGE_METADATA',
      'SYSTEM',
      'METADATA',
      'CONNECTION',
      'SESSION',
      '__system__',
      'sm-',
      'soul-',
    ];

    // Check if the message contains system keywords
    const isSysMsg = systemKeywords.some((kw) => t.text.toLowerCase().includes(kw.toLowerCase()));

    // Only include non-system messages with actual conversational content
    return !isSysMsg && t.text.trim().length > 0;
  });

  // Add ESC key handler to export transcript
  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.key === 'Escape') {
        console.log('🚨 ESC detected in STTFeedback - exporting transcript...');
        console.log('📊 Filtered transcript to export:', transcriptOnlyText);
        
        try {
          // Use the already filtered transcript data
          const exportData = {
            sessionId: `session_${Date.now()}`,
            timestamp: new Date().toISOString(),
            messages: transcriptOnlyText.map(entry => ({
              source: entry.source,
              text: entry.text,
              timestamp: entry.timestamp || new Date().toISOString(),
            })),
            messageCount: transcriptOnlyText.length,
            sessionDuration: null,
            exitMethod: 'ESC_KEY',
          };

          console.log('📤 Exporting data:', exportData);
          
          // Call the export function with the raw transcript (the function will filter it)
          await exportTranscriptToDatabase(transcript);
          console.log('✅ Transcript exported successfully from STTFeedback');
        } catch (error) {
          console.error('❌ Failed to export transcript from STTFeedback:', error);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transcript, transcriptOnlyText]); // Depend on the transcript data

  // Add debug logging
  useEffect(() => {
    console.log('📋 STTFeedback - Raw transcript:', transcript);
    console.log('📋 STTFeedback - Filtered transcript:', transcriptOnlyText);
    console.log('📋 STTFeedback - Transcript length:', transcript?.length || 0);
    console.log('📋 STTFeedback - Filtered length:', transcriptOnlyText?.length || 0);
  }, [transcript, transcriptOnlyText]);

  // Show last 3 messages, most recent first - only if we have actual conversation
  const recentTranscript = transcriptOnlyText.length > 0
    ? transcriptOnlyText.slice(-3).reverse()
    : [];

  return (
    <div className={className}>
      <div className="stt-container">
        {/* Recent Transcript - Always show the section */}
        <div className="transcript-section">
          <div className="transcript-list">
            {recentTranscript.length > 0 ? (
              recentTranscript.map((entry) => {
                const isUser = entry.source === 'user';
                return (
                  <div
                    key={`${entry.source}-${entry.text.substring(0, 20)}`}
                    className="message-container"
                    style={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      marginBottom: '0.75rem',
                      width: '100%',
                    }}
                  >
                    <div
                      className="message-bubble"
                      style={{
                        backgroundColor: isUser ? '#E5E5EA' : '#007AFF',
                        color: isUser ? '#000000' : '#ffffff',
                        padding: '0.75rem 1rem',
                        borderRadius: '18px',
                        borderBottomLeftRadius: isUser ? '18px' : '6px',
                        borderBottomRightRadius: isUser ? '6px' : '18px',
                        maxWidth: '70%',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        wordWrap: 'break-word',
                      }}
                    >
                      <div
                        className="message-speaker"
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          marginBottom: '0.3rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          opacity: '0.8',
                        }}
                      >
                        {entry.source === 'user' ? 'You' : 'AI CEO'}
                      </div>
                      <div
                        className="message-text"
                        style={{
                          fontSize: '1rem',
                          lineHeight: '1.4',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                          fontWeight: '400',
                        }}
                      >
                        {entry.text}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-transcript">
                Conversation history will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

STTFeedback.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(STTFeedback)`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;

  .stt-container {
    background: transparent;
    backdrop-filter: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 600px;
    width: 100%;
    border: none;
    height: 280px;
    display: flex;
    flex-direction: column;
  }

  .current-input {
    flex-shrink: 0;
    margin-bottom: 1rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    &.listening {
      .input-header {
        color: #3b82f6;
      }

      .input-text {
        background: rgba(59, 130, 246, 0.05);
        border-color: #3b82f6;
      }
    }
  }

  .input-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #6b7280;
    font-size: 0.9rem;
    font-weight: 600;
    transition: color 0.2s ease;
  }

  .mic-indicator {
    display: flex;
    align-items: center;

    svg {
      transition: color 0.2s ease;

      &.active {
        color: #3b82f6;
      }
    }
  }

  .listening-indicator {
    display: flex;
    gap: 0.25rem;
    margin-left: auto;

    .pulse {
      width: 6px;
      height: 6px;
      background: #3b82f6;
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.3s;
      }

      &:nth-child(3) {
        animation-delay: 0.6s;
      }
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }
  }

  .input-text {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
    font-size: 1rem;
    color: #1a202c;
    min-height: 48px;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .transcript-section {
    border-top: none;
    padding-top: 0;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .transcript-header {
    font-size: 1rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .transcript-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
    flex: 1;
    padding-right: 0.5rem;

    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;

      &:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    }

    /* Firefox scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);
  }

  .no-transcript {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #9ca3af;
    font-style: italic;
    font-size: 0.95rem;
    text-align: center;
  }

  .transcript-entry {
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 8px;
    border-left: 3px solid #e2e8f0;
  }

  .transcript-speaker {
    font-size: 0.8rem;
    font-weight: 600;
    color: #3b82f6;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .transcript-text {
    font-size: 0.95rem;
    color: #4b5563;
    line-height: 1.4;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
`;
