import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

function Landing({ className }) {
  const history = useHistory();
  const handleVideoEnd = (e) => {
    e.target.currentTime = 0;
    e.target.play();
  };

  useEffect(() => {
    // Check if we need to force refresh after feedback completion
    const forceRefresh = sessionStorage.getItem('forceRefreshAfterFeedback');

    if (forceRefresh === 'true') {
      // Clear the flag first to prevent infinite loops
      sessionStorage.removeItem('forceRefreshAfterFeedback');

      // Clear all storage to ensure no cached state
      sessionStorage.clear();
      localStorage.clear();

      // Force hard reload by reloading the current page
      window.location.reload(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = () => {
      // Clear any refresh flags when starting new session
      sessionStorage.removeItem('needsRefresh');
      history.push('/loading');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [history]);

  return (
    <div className={className}>
      <video onEnded={handleVideoEnd} autoPlay muted loop playsInline className="background-video">
        <source src="/static/video/Axios_PreScreen_002.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay-content">
        {/* <h1>Meet Ave!</h1>
        <h4>Ave is a digital Axios CEO. She is an expert in Journalism, A.I., and Axios.</h4> */}
        {/* <Link to="/loading" className="chat-button">
          PRESS ANY KEY TO START
        </Link> */}
        {/* <p className="terms">
          Link terms & conditions or company website here:
          <br />
          <a href="https://example.com">www.example.com</a>
        </p> */}
      </div>
    </div>
  );
}

Landing.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(Landing)`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .overlay-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: white;
    padding: 40px;
  }

  .overlay-content h1 {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .overlay-content h4 {
    font-size: 1.2rem;
    font-weight: 300;
    margin-bottom: 2rem;
    max-width: 600px;
  }

  .chat-button {
    background: #0055ff;
    color: white;
    padding: 16px 24px;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 10px;
    text-decoration: none;
    margin-bottom: 1.5rem;
  }

  .terms {
    font-size: 0.85rem;
    color: #ccc;
  }

  .terms a {
    color: #ccc;
    text-decoration: underline;
  }
`;
