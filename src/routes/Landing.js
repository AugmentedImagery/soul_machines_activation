import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Landing({ className }) {
  return (
    <div className={className}>
      <div className="landing-wrapper">
        <div className="content">
          <div className="left-section">
            <h1>Meet Ave!</h1>
            <h4>
              Ave is a digital Axios CEO. She is an expert in Journalism, A.I., and Axios.
            </h4>

            <Link to="/loading" className="chat-button">
              Chat with Digital Person A
            </Link>

            <p className="terms">
              Link terms & conditions or company website here:
              <br />
              <a href="https://example.com">www.example.com</a>
            </p>
          </div>

          <div className="right-section">
            <div className="portrait" />
            <p className="instruction">Enable your camera and mic to optimize our interaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}

Landing.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(Landing)`
  .landing-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f6f8;
    font-family: sans-serif;
  }

  .content {
    display: flex;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 90%;
    max-width: 1000px;
  }

  .left-section {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .left-section h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
  }

  .left-section h4 {
    font-weight: 300;
    margin: 0;
    line-height: 1.4;
  }

  .chat-button {
    display: inline-block;
    margin-top: 10px;
    background: #0055ff;
    color: white;
    padding: 16px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 10px;
    text-decoration: none;
  }

  .terms {
    font-size: 0.85rem;
    color: #666;
  }

  .right-section {
    flex: 1;
    padding: 40px;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .portrait {
    width: 220px;
    height: 280px;
    background-image: url('/static/img/ceo-portrait.png');
    background-size: cover;
    background-position: center;
    border-radius: 12px;
  }

  .instruction {
    margin-top: 20px;
    font-style: italic;
    font-size: 0.9rem;
    text-align: center;
  }
`;
