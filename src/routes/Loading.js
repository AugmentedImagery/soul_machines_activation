import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { createScene } from '../store/sm';
import Header from '../components/Header';
import { headerHeight } from '../config';
import backgroundImage from '../img/Background_001.png';

function Loading({ className }) {
  const {
    connected,
    loading,
    error,
    connectionState,
  } = useSelector(({ sm }) => sm);
  const dispatch = useDispatch();

  const {
    percentageLoaded, name, currentStep, totalSteps,
  } = connectionState;

  const stateNameMap = {
    SearchingForDigitalPerson: 'Searching For Digital Person',
    DownloadingAssets: 'Downloading Assets',
    ConnectingToDigitalPerson: 'Connecting To Digital Person',
  };
  const stateName = (name in stateNameMap) ? stateNameMap[name] : name;

  useEffect(() => {
    if (!loading && !connected && error === null) {
      dispatch(createScene());
    }
  }, [loading, connected, error, dispatch]);

  const history = useHistory();

  useEffect(() => {
    if (connected && percentageLoaded === 100) {
      history.push('/video');
    }
  }, [connected, percentageLoaded, history]);

  return (
    <div className={className}>
      <Header />
      <div className="loading-wrapper">
        <div className="progress-block">
          <div
            className="progress-bar"
            style={{ width: `${percentageLoaded}%` }}
            aria-valuenow={percentageLoaded}
            aria-valuemin="0"
            aria-valuemax="100"
          />
          {stateName && (
            <p className="progress-text">
              {`${stateName} (${currentStep} out of ${totalSteps - 1} steps)`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

Loading.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(Loading)`
  background:
    url(${backgroundImage}) center/cover no-repeat,
    linear-gradient(135deg, #0066ff, #66b3ff, #ffffff);
  width: 100vw;
  height: 100vh;
  font-family: sans-serif;

  .loading-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - ${headerHeight});
  }

  .progress-block {
    width: 90%;
    max-width: 500px;
    margin: 0 auto;
  }

  .progress-bar {
    height: 8px;
    background: #ffffff;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.8rem;
    color: #ffffff;
    margin-top: 6px;
    text-align: center;
  }
`;
