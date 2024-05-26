// src/setupTests.js
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

// Optional: Add serializer for Enzyme to Jest
import { createSerializer } from 'enzyme-to-json';
expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));
