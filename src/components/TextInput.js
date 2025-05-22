import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Send } from 'react-bootstrap-icons';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sendTextMessage } from '../store/sm';

function TextInput({ className }) {
  const [textInput, setText] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const inputRef = useRef(null);

  const handleInput = (e) => setText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
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

  // Handle escape key to exit to feedback
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        history.push('/feedback');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [history]);

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

      <div className="escape-hint">
        <div className="escape-instruction">
          Press
          {' '}
          <kbd>ESC</kbd>
          {' '}
          to exit and provide feedback
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

  .escape-hint {
    text-align: center;
    margin-top: 1rem;

    .escape-instruction {
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 1rem;
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
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 700;
      border: 2px solid #d1d5db;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      margin: 0 0.25rem;
      display: inline-block;
      min-width: 45px;
      text-align: center;
    }
  }
`;
