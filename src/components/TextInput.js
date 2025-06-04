import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Send } from 'react-bootstrap-icons';
import { useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { sendTextMessage } from '../store/sm';

// CONFIGURABLE QUESTIONS - Easy to modify when you get final questions from client
const PRESET_QUESTIONS = {
  0: "What keeps CEO's up at night when it comes to AI?",
  1: "Should I be worried AI will replace my job or excited it might help me do better??",
  2: "Are most CEO's planning to use AI to cut costs or to innovate?",
  3: "What's the difference between traditional AI and agentic AI?",
  4: "How rapidly will AI shift jobs in the future?",
  5: "What's the one thing bussiness leaders aren't saying out loud about AI and jobs?",
  6: "What are some common trends you see happening in AI?",
  7: "Are leaders investing in AI because they believe in it or because they're not afraid to?",
  8: "What leaders or industries are rushing to adopt AI and why??",
  9: "What's going on around the venue today?"
};

function TextInput({ className }) {
  const [textInput, setText] = useState('');
  const dispatch = useDispatch();
  // const history = useHistory();
  const inputRef = useRef(null);

  const handleInput = (e) => setText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      console.log('📤 Sending message:', textInput); // Debug log
      dispatch(sendTextMessage({ text: textInput }));
      setText('');
    }
  };

  // Auto-focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (event) => {
      // Handle escape key to exit to feedback (navigation only)
      if (event.key === 'Escape') {
        console.log('🚨 ESC key detected in TextInput - handling navigation only');
        
        // Small delay to let STTFeedback handle the export first
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear all storage and force hard reload to feedback
        sessionStorage.clear();
        localStorage.clear();
        // history.push('/feedback');
        window.location.href = `/feedback?refresh=${Date.now()}`;
        return;
      }

      // Handle number keys (0-9) for preset questions
      if (event.key >= '0' && event.key <= '9') {
        // Only trigger if the input is focused or no other input element is focused
        const activeElement = document.activeElement;
        const isInputFocused = activeElement === inputRef.current;
        const isOtherInputFocused = activeElement && (
          activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.isContentEditable
        );

        // Only fill preset question if our input is focused or no input is focused
        if (isInputFocused || !isOtherInputFocused) {
          event.preventDefault(); // Prevent default number input
          const questionKey = event.key;
          const presetQuestion = PRESET_QUESTIONS[questionKey];
          
          if (presetQuestion) {
            console.log(`🔢 Number key ${questionKey} pressed - filling preset question`);
            setText(presetQuestion);
            
            // Focus the input after filling the question
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // No dependencies needed

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <input
            ref={inputRef}
            value={textInput}
            onChange={handleInput}
            className="text-input"
            placeholder="Type your message here..."
          />
          <button
            className="send-button"
            type="submit"
            aria-label="Send message"
            disabled={!textInput.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      <div className="shortcuts-hint">
        <div className="shortcut-instruction">
          Press <kbd>0-9</kbd> for quick questions • Press <kbd>ESC</kbd> to exit
        </div>
      </div>
    </div>
  );
}

TextInput.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(TextInput)`
  width: 100%;
  max-width: 100%;

  .input-form {
    width: 100%;
  }

  .input-container {
    display: flex;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
      transform: translateY(-2px);
    }
  }

  .text-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 1rem 1.25rem;
    font-size: 1.1rem;
    background: transparent;
    color: #1a202c;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

    &::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }

    &:focus {
      outline: none;
    }
  }

  .send-button {
    background: #3b82f6;
    border: none;
    padding: 1rem 1.25rem;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 60px;

    &:hover:not(:disabled) {
      background: #2563eb;
      transform: scale(1.05);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      background: #cbd5e0;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .shortcuts-hint {
    text-align: center;
    margin-top: 1rem;

    .shortcut-instruction {
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      display: inline-block;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes glow {
      from {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(255, 255, 255, 0.4);
      }
      to {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.1);
      }
    }

    kbd {
      background: #f3f4f6;
      color: #374151;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 700;
      border: 2px solid #d1d5db;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      margin: 0 0.25rem;
      display: inline-block;
      text-align: center;
    }
  }
`;