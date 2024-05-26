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
