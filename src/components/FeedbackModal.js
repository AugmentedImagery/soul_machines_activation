import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Star, StarFill } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import breakpoints from '../utils/breakpoints';
import { landingBackgroundImage } from '../config';

function FeedbackModal({ className }) {
  const nStars = 5;
  const [rating, setRating] = useState(-1);
  const [ratingSelected, setRatingSelected] = useState(false);
  const [hoverRating, setHoverRating] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const [writtenFeedback, setWrittenFeedback] = useState('');

  const textareaRef = useRef(null);
  const history = useHistory();

  // Auto-focus the textarea when rating is selected
  // Handle keyboard input for star rating (1-5 keys) and Enter for submission
  useEffect(() => {
    if (ratingSelected && textareaRef.current) {
      // Small delay to ensure the textarea is rendered
      setTimeout(() => {
        textareaRef.current.focus();
      }, 100);
    }
  }, [ratingSelected]);
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
            ? <StarFill className="star star-fill" />
            : <Star className="star star-outline" />
        }
        <span className="number-indicator">{i + 1}</span>
      </button>
    );
  });

  const getRatingText = () => {
    if (rating < 0) return '';

    const ratingTexts = [
      'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!',
    ];
    return ratingTexts[rating];
  };

  return (
    <div className={className}>
      <div className="feedback-container">
        <div className="avatar-wrapper">
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
            <h2>
              How was your experience?
            </h2>

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
  );
}

FeedbackModal.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(FeedbackModal)`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  .feedback-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    padding: 2.5rem;
    max-width: 550px;
    width: 100%;
    margin: 0 auto;

    @media (max-width: ${breakpoints.sm}px) {
      padding: 1.5rem;
    }
  }

  .avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .avatar-circle {
    width: 110px;
    height: 110px;
    border-radius: 55px;
    background-image: url(${landingBackgroundImage});
    background-size: cover;
    background-position: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    border: 4px solid white;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }

    @media (max-width: ${breakpoints.sm}px) {
      width: 90px;
      height: 90px;
      border-radius: 45px;
    }
  }

  h2 {
    font-size: 1.75rem;
    text-align: center;
    color: #1a202c;
    margin-bottom: 1.75rem;
    font-weight: 700;
    line-height: 1.3;

    @media (max-width: ${breakpoints.sm}px) {
      font-size: 1.5rem;
      margin-bottom: 1.25rem;
    }
  }

  p {
    text-align: center;
    color: #4a5568;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .stars-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    position: relative;
  }

  .star-wrapper {
    display: inline;
    border: none;
    background: transparent;
    padding: 0.5rem;
    margin: 0 0.25rem;
    transition: transform 0.2s ease;
    cursor: pointer;
    position: relative;

    &:hover {
      transform: scale(1.15);
    }

    @media (min-width: ${breakpoints.sm}px) {
      padding: 0.5rem;
      margin: 0 0.5rem;
    }

    @media (min-width: ${breakpoints.md}px) {
      padding: 0.5rem;
      margin: 0 0.75rem;
    }

    .number-indicator {
      position: absolute;
      bottom: -22px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.875rem;
      font-weight: 600;
      color: #4a5568;
    }
  }

  .star {
    width: 2rem;
    height: 2rem;

    @media (min-width: ${breakpoints.sm}px) {
      width: 2.5rem;
      height: 2.5rem;
    }
    @media (min-width: ${breakpoints.md}px) {
      width: 3rem;
      height: 3rem;
    }
  }

  .star-fill {
    color: #f59e0b;
    filter: drop-shadow(0 3px 6px rgba(245, 158, 11, 0.35));
  }

  .star-outline {
    color: #e2e8f0;
  }

  .keyboard-hint {
    text-align: center;
    margin: 2rem 0 1rem;
    font-size: 0.9rem;
    color: #718096;
    background: #f7fafc;
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
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;

    @media (max-width: ${breakpoints.sm}px) {
      flex-direction: column;
    }
  }

  .thank-you-container {
    text-align: center;

    .success-icon {
      width: 65px;
      height: 65px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      margin: 0 auto 1.5rem;
      box-shadow: 0 10px 15px rgba(16, 185, 129, 0.25);
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;

      @media (max-width: ${breakpoints.sm}px) {
        flex-direction: column;
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
    padding: 0.75rem 1.5rem;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.25s ease;
    border: none;

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    @media (max-width: ${breakpoints.sm}px) {
      width: 100%;
      text-align: center;
      margin-bottom: 0.5rem;
    }
  }

  .primary-btn {
    background: #3b82f6;
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

    &:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3);
    }

    &:active:not(:disabled) {
      transform: translateY(-1px);
    }
  }

  .secondary-btn {
    background: white;
    color: #4a5568;
    border: 1px solid #e2e8f0;

    &:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e0;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }

    &:active:not(:disabled) {
      transform: translateY(-1px);
    }
  }
`;
