// import reportWebVitals from '../reportWebVitals';

// // Mock the 'web-vitals' module
// jest.mock('web-vitals', () => ({
//   getCLS: jest.fn(),
//   getFID: jest.fn(),
//   getFCP: jest.fn(),
//   getLCP: jest.fn(),
//   getTTFB: jest.fn()
// }));

// describe('reportWebVitals', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('calls web vital methods when onPerfEntry is a function', async () => {
//     const onPerfEntry = jest.fn();

//     await reportWebVitals(onPerfEntry);

//     expect(require('web-vitals').getCLS).toHaveBeenCalledWith(onPerfEntry);
//     expect(require('web-vitals').getFID).toHaveBeenCalledWith(onPerfEntry);
//     expect(require('web-vitals').getFCP).toHaveBeenCalledWith(onPerfEntry);
//     expect(require('web-vitals').getLCP).toHaveBeenCalledWith(onPerfEntry);
//     expect(require('web-vitals').getTTFB).toHaveBeenCalledWith(onPerfEntry);
//   });

//   it('does not call web vital methods when onPerfEntry is not provided', async () => {
//     await reportWebVitals();

//     expect(require('web-vitals').getCLS).not.toHaveBeenCalled();
//     expect(require('web-vitals').getFID).not.toHaveBeenCalled();
//     expect(require('web-vitals').getFCP).not.toHaveBeenCalled();
//     expect(require('web-vitals').getLCP).not.toHaveBeenCalled();
//     expect(require('web-vitals').getTTFB).not.toHaveBeenCalled();
//   });

//   it('does not call web vital methods when onPerfEntry is not a function', async () => {
//     await reportWebVitals({});

//     expect(require('web-vitals').getCLS).not.toHaveBeenCalled();
//     expect(require('web-vitals').getFID).not.toHaveBeenCalled();
//     expect(require('web-vitals').getFCP).not.toHaveBeenCalled();
//     expect(require('web-vitals').getLCP).not.toHaveBeenCalled();
//     expect(require('web-vitals').getTTFB).not.toHaveBeenCalled();
//   });
// });


import reportWebVitals from '../reportWebVitals';
import * as webVitals from 'web-vitals';

// Mock the 'web-vitals' module
jest.mock('web-vitals', () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn()
}));

describe('reportWebVitals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not call web vital methods when onPerfEntry is not provided', async () => {
    const promise = reportWebVitals();
    await promise;

    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('does not call web vital methods when onPerfEntry is not a function', async () => {
    const promise = reportWebVitals({});
    await promise;

    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('handles import failure gracefully', async () => {
    jest.mock('web-vitals', () => Promise.reject(new Error('Failed to load module')));
    const onPerfEntry = jest.fn();
    await reportWebVitals(onPerfEntry);
    expect(onPerfEntry).not.toHaveBeenCalled();
  });
});
