// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import crypto from 'crypto-browserify';

// Polyfill window.crypto for Auth0 in jsdom environment
if (typeof window !== 'undefined') {
  if (!window.crypto) {
    window.crypto = {
      getRandomValues: function(buffer) {
        return crypto.randomFillSync(buffer);
      }
    };
  }
}
