import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  logo, logoAltText, transparentHeader, headerHeight, logoLink,
} from '../config';

function Header({
  className,
}) {
  return (
    <div className={`${className}`}>
      <div className="container">
        <div className="row">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {/* left align - logo only */}
              <Link to={logoLink}>
                <img src={logo} className="logo position-relative" alt={logoAltText} />
              </Link>
            </div>
            <div>
              {/* middle align - empty */}
            </div>
            <div>
              {/* right align - no controls, clean interface */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(Header)`
  position: relative;
  z-index: 20;
  top: 0;
  width: 100%;
  background-color: ${transparentHeader ? 'none' : '#FFFFFF'};

  &>.row {
    height: ${headerHeight};
  }

  .logo {
    margin-top: 20px;
    height: auto;
    max-width: 30vw;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }

    // Medium devices (tablets, 768px and up)
    @media (min-width: 768px) {
      height: calc(0.8 * ${headerHeight});
    }
  }
`;
