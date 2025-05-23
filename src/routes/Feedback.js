import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Star, StarFill, XCircle
} from 'react-bootstrap-icons';
import Header from '../components/Header';
import { headerHeight, landingBackgroundImage } from '../config';

function Feedback({ className }) {
  const { presumeTimeout } = useSelector(({ sm }) => ({ ...sm }));

  const nStars = 5;
  const [rating, setRating] = useState(-1);
  const [ratingSelected, setRatingSelected] = useState(false);
  const [hoverRating, setHoverRating] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const [writtenFeedback, setWrittenFeedback] = useState('');

  const textareaRef = useRef(null);
  const history = useHistory();

  // Auto-focus the textarea when rating is selected
  useEffect(() => {
    if (ratingSelected && textareaRef.current) {
      // Small delay to ensure the textarea is rendered
      setTimeout(() => {
        textareaRef.current.focus();
      }, 100);
    }
  }, [ratingSelected]);

  // Handle keyboard input for star rating (1-5 keys) and Enter for submission
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = parseInt(event.key, 10);

      // Handle number keys 1-5 for rating
      if (key >= 1 && key <= 5 && !ratingSelected) {
        const starIndex = key - 1;
        setRating(starIndex);
        setRatingSelected(true);
        setHoverRating(-1);
      }

      // Handle Enter key for submission (only if rating is selected)
      if (event.key === 'Enter' && ratingSelected) {
        event.preventDefault();
        setSubmitted(true);

        // Set flag to trigger page refresh when returning to landing
        sessionStorage.setItem('needsRefresh', 'true');

        // Navigate to landing page after showing thank you message
        setTimeout(() => {
          history.push('/');
        }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [history, ratingSelected]);

  // generate array of clickable stars for rating
  const stars = Array.from(Array(nStars)).map((_, i) => {
    const handleHover = () => {
      if (!ratingSelected) setHoverRating(i);
    };

    const handleHoverLeave = () => {
      if (!ratingSelected) setHoverRating(-1);
    };

    const effectiveRating = hoverRating >= 0 ? hoverRating : rating;

    return (
      <button
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        className="star-wrapper"
        type="button"
        onMouseOver={handleHover}
        onMouseLeave={handleHoverLeave}
        onFocus={handleHover}
        onClick={() => {
          setRating(i);
          setRatingSelected(true);
          setHoverRating(-1);
        }}
        aria-label={`Rate ${i + 1} stars`}
      >
        {
          effectiveRating >= i
            ? <StarFill size={42} className="star-fill" />
            : <Star size={42} className="star-outline" />
        }
        <span className="number-indicator">{i + 1}</span>
      </button>
    );
  });

  const [alertModal, setAlertModal] = useState(null);

  useEffect(() => {
    if (presumeTimeout) {
      setAlertModal(
        <div className="alert-modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close-button"
              onClick={() => setAlertModal(null)}
              aria-label="Close"
            >
              <XCircle size={24} />
            </button>
          </div>
          <h3>
            Session Timed Out
          </h3>
          <p>
            Your session ended due to inactivity. You can start again or provide feedback to help us improve the platform.
          </p>
          <div className="modal-actions">
            <Link className="btn primary-btn" to="/loading">Start Again</Link>
            <button
              className="btn secondary-btn"
              onClick={() => { setAlertModal(null); }}
              type="button"
            >
              Provide Feedback
            </button>
          </div>
        </div>
      );
    }
  }, [presumeTimeout]);

  const getRatingText = () => {
    if (rating < 0) return '';

    const ratingTexts = [
      'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'
    ];
    return ratingTexts[rating];
  };

  return (
    <div className={className}>
      {alertModal !== null && (
        <div className="alert-modal">
          {alertModal}
        </div>
      )}

      <Header />

      <div className="feedback-container">
        <div className="feedback-card">
          <div className="avatar-container">
            <div className="avatar-circle" />
          </div>

          {submitted ? (
            <div className="thank-you-container">
              <div className="success-icon">✓</div>
              <h2>Thank you for your feedback!</h2>
              <p>
                Your rating:
                {' '}
                {getRatingText()}
              </p>
              {writtenFeedback && (
                <div className="submitted-feedback">
                  <p><strong>Your feedback:</strong></p>
                  <p>
                    &quot;
                    {writtenFeedback}
                    &quot;
                  </p>
                </div>
              )}
              <p className="redirect-message">Returning to home page...</p>
            </div>
          ) : (
            <div className="feedback-form">
              <h2>How was your experience?</h2>

              <div className="stars-container">
                {stars}
              </div>

              <div className="keyboard-hint">
                Press keys 1-5 to rate
              </div>

              <div className="rating-label">
                {rating >= 0 && (
                  <span className="rating-badge">
                    {getRatingText()}
                  </span>
                )}
              </div>

              {ratingSelected && (
                <div className="written-feedback-section">
                  <h3>Tell us more about your experience (optional)</h3>
                  <div className="textarea-grid-container">
                    <textarea
                      ref={textareaRef}
                      className="feedback-textarea full-width-textarea"
                      placeholder="Type your feedback here..."
                      value={writtenFeedback}
                      onChange={(e) => setWrittenFeedback(e.target.value)}
                      rows={4}
                      maxLength={500}
                    />
                  </div>
                  <div className="submit-instruction">
                    Press Enter to submit your feedback
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Feedback.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(Feedback)`
  min-height: 100vh;
  background: linear-gradient(145deg, #f9fafb 0%, #edf2f7 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  .feedback-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - ${headerHeight});
    padding: 2rem 1rem;
  }

  .feedback-card {
    background: white;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.03);
    padding: 3rem;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    @media (max-width: 640px) {
      padding: 2rem 1.5rem;
      border-radius: 20px;
    }
  }

  .avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .avatar-circle {
    width: 110px;
    height: 110px;
    border-radius: 55px;
    background-image: url(${landingBackgroundImage});
    background-size: cover;
    background-position: center;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border: 4px solid white;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18);
    }
  }

  h2 {
    font-size: 1.9rem;
    text-align: center;
    color: #1a202c;
    margin-bottom: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  h3 {
    font-size: 1.25rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  p {
    text-align: center;
    color: #64748b;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    line-height: 1.6;
  }

  .stars-container {
    display: flex;
    justify-content: center;
    margin-bottom: 0.75rem;
    position: relative;
  }

  .star-wrapper {
    background: transparent;
    border: none;
    padding: 0.25rem;
    margin: 0 0.4rem;
    transition: transform 0.2s ease;
    color: #f6ad55;
    cursor: pointer;
    position: relative;

    &:hover {
      transform: scale(1.15);
    }

    .star-fill {
      color: #f59e0b;
      filter: drop-shadow(0 3px 6px rgba(245, 158, 11, 0.35));
    }

    .star-outline {
      color: #e2e8f0;
      transition: color 0.2s ease;

      &:hover {
        color: #cbd5e0;
      }
    }

    .number-indicator {
      position: absolute;
      bottom: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.9rem;
      font-weight: 600;
      color: #64748b;
      opacity: 0.9;
    }
  }

  .keyboard-hint {
    text-align: center;
    margin: 2rem 0 1rem;
    font-size: 0.9rem;
    color: #94a3b8;
    background: #f8fafc;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    width: auto;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .rating-label {
    text-align: center;
    height: 2rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rating-badge {
    font-weight: 600;
    color: #4a5568;
    background-color: #f7fafc;
    padding: 0.5rem 1.25rem;
    border-radius: 100px;
    font-size: 1rem;
    display: inline-block;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .written-feedback-section {
    margin-top: 2rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;

    h3 {
      text-align: center;
      margin-bottom: 0;
      font-size: 1.1rem;
      color: #2d3748;
      width: 100%;
      grid-column: 1;
    }
  }

  .textarea-grid-container {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .feedback-textarea,
  .full-width-textarea {
    grid-column: 1;
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    padding: 1rem !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 12px !important;
    font-size: 1rem !important;
    font-family: inherit !important;
    resize: vertical !important;
    min-height: 120px !important;
    background: white !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    display: block !important;
    position: relative !important;
    left: 0 !important;
    right: 0 !important;

    &:focus {
      outline: none !important;
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
    }

    &::placeholder {
      color: #9ca3af !important;
    }
  }

  /* Nuclear option - target any textarea inside our component */
  .feedback-card textarea {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 1rem !important;
  }

  .submit-instruction {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #6b7280;
    background: #e5f3ff;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    font-weight: 500;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(74, 85, 104, 0.2);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(74, 85, 104, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(74, 85, 104, 0);
    }
  }

  .thank-you-container {
    text-align: center;

    .success-icon {
      width: 70px;
      height: 70px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }

    p {
      margin-bottom: 1rem;
      font-size: 1.1rem;
      color: #64748b;
    }

    .redirect-message {
      font-size: 0.9rem !important;
      opacity: 0.6 !important;
      margin-top: 1.5rem !important;
    }
  }

  .submitted-feedback {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1rem;
    margin: 1rem 0;
    border-left: 4px solid #3b82f6;

    p {
      margin-bottom: 0.5rem;
      text-align: left;

      &:last-child {
        margin-bottom: 0;
        font-style: italic;
      }
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.8rem 1.75rem;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.25s ease;
    border: none;
    letter-spacing: 0.01em;
    gap: 0.5rem;

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    @media (max-width: 480px) {
      width: 100%;
      text-align: center;
    }
  }

  .primary-btn {
    background: #3b82f6;
    color: white;
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.25);

    &:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
    }

    &:active:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
    }
  }

  .secondary-btn {
    background: white;
    color: #475569;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

    &:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e0;
      transform: translateY(-2px);
      box-shadow: 0 5px 12px rgba(0, 0, 0, 0.08);
    }

    &:active:not(:disabled) {
      transform: translateY(-1px);
    }
  }

  .alert-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .alert-modal-content {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    padding: 2.5rem;
    max-width: 450px;
    width: 100%;
    text-align: center;
    animation: slideUp 0.3s ease;

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    h3 {
      margin-bottom: 1.25rem;
      font-weight: 700;
      font-size: 1.5rem;
      color: #1a202c;
    }

    p {
      margin-bottom: 2rem;
      color: #64748b;
    }
  }

  .modal-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }

  .close-button {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #475569;
      background: #f1f5f9;
      transform: rotate(90deg);
    }
  }

  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;

    @media (max-width: 480px) {
      flex-direction: column;
    }

    .btn {
      @media (max-width: 480px) {
        width: 100%;
      }
    }
  }
`;
