import { connect } from 'react-redux';
import styled from 'styled-components';

function Captions() {
  // Component exists but renders nothing - captions are handled in transcript
  return null;
}

const StyledCaptions = styled(Captions)`
  /* No styles needed since component renders nothing */
`;

const mapStateToProps = (state) => ({
  speechState: state.sm.speechState,
  lastPersonaUtterance: state.sm.lastPersonaUtterance,
  connected: state.sm.connected,
});

export default connect(mapStateToProps)(StyledCaptions);
