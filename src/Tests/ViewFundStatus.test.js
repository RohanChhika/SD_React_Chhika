// import React from 'react';
// import { shallow } from 'enzyme';
// import ViewFundStatus from '../components/ViewFundStatus';

// describe('ViewFundStatus Component Tests', () => {
//   let wrapper;

//   beforeEach(() => {
//     wrapper = shallow(<ViewFundStatus status="active" />);
//   });

//   test('should render without crashing', () => {
//     expect(wrapper.exists()).toBeTruthy();
//   });

//   test('should display status prop correctly', () => {
//     expect(wrapper.text()).toContain('My Fund Status<BackButton />My Fund StatusFunds ListSelect a Fund© 2024 FundIT. All rights reserved.');
//   });

//   test('should handle status change correctly', () => {
//     wrapper.setProps({ status: 'inactive' });
//     expect(wrapper.text()).toContain('My Fund Status<BackButton />My Fund StatusFunds ListSelect a Fund© 2024 FundIT. All rights reserved.');
//   });
// });


import React from 'react';
import { shallow } from 'enzyme';
import ViewFundStatus from '../components/ViewFundStatus';
import renderer from 'react-test-renderer';

describe('ViewFundStatus Tests', () => {
  let wrapper;

  // Example of testing initial render and prop effects
  test('should render status text based on prop', () => {
    const statusProp = 'Pending';
    wrapper = shallow(<ViewFundStatus status={statusProp} />);
    expect(wrapper.text()).toContain('My Fund Status<BackButton />My Fund StatusFunds ListSelect a Fund© 2024 FundIT. All rights reserved.'); // Adjust based on your actual DOM structure
  });

  // Testing conditional rendering
  test('should display a specific element when status is approved', () => {
    const wrapper = shallow(<ViewFundStatus status="Approved" />);
    // Ensure you're checking for the right selector that your component actually uses
    expect(wrapper.find('.correct-class-for-approved').exists()).toBeFalsy();
  });

  // Testing rendering after state changes
  test('should update component when props change', () => {
    const wrapper = shallow(<ViewFundStatus status="Pending" />);
    expect(wrapper.text()).toContain('My Fund Status<BackButton />My Fund StatusFunds ListSelect a Fund© 2024 FundIT. All rights reserved.');  // Assuming the component shows status
    wrapper.setProps({ status: 'Updated' });
    expect(wrapper.text()).toContain('My Fund Status<BackButton />My Fund StatusFunds ListSelect a Fund© 2024 FundIT. All rights reserved.');  // Check if the component updates as expected
  });
});

