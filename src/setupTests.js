// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import crypto from 'crypto-browserify';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

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


configure({ adapter: new Adapter() });

// Optional: Add serializer for Enzyme to Jest
import { createSerializer } from 'enzyme-to-json';
expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));