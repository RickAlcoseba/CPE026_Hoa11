// utils/MessageUtils.js
import PropTypes from 'prop-types';

// Defines the shape of a message object [cite: 30-37]
export const MessageShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['text', 'image', 'location']).isRequired, // Added .isRequired for type
  text: PropTypes.string,
  uri: PropTypes.string,
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
});

let messageId = 0;

function getNextId() {
  messageId += 1;
  return messageId;
}

// Utility functions for creating message objects [cite: 48-67]
export function createTextMessage(text) {
  return {
    type: 'text',
    id: getNextId(),
    text,
  };
}

export function createImageMessage(uri) {
  return {
    type: 'image',
    id: getNextId(),
    uri,
  };
}

export function createLocationMessage(coordinate) {
  return {
    type: 'location',
    id: getNextId(),
    coordinate,
  };
}