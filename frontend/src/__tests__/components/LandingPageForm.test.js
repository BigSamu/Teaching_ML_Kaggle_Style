import React from 'react';
import { shallow } from 'enzyme';
import LandingPageForm from '../../components/LandingPageForm';

jest.mock('react-redux', () => ({
    useDispatch: () => {},
    useSelector: () => ({
      cohorts: [{name: "cohort1"}, {name: "cohort2"}, {name: "cohort3"}],
    }),
  }));

let [handleFormFieldChange, handleSubmit] = new Array(2).fill(jest.fn());
const props = {
  firstName: '',
  lastName: '',
  cohort: '',
  handleFormFieldChange: handleFormFieldChange,
  handleSubmit: handleSubmit
}

var enzymeWrapper = shallow(<LandingPageForm {...props}/>);

test('component LandingPageForm renders without crashing', () => {
    expect(enzymeWrapper.exists()).toBe(true);
}); 

test('component LandingPageForm renders correctly form with two textfields, the dropdown menu and two buttons', () => {
  expect(enzymeWrapper.find('#testId-userFirstNameTextField')).toHaveLength(1); //first name textfield
  expect(enzymeWrapper.find('#testId-userLastNameTextField')).toHaveLength(1); //last name textfield
  expect(enzymeWrapper.find('#testId-cohortDropdownMenu')).toHaveLength(1); //cohort dropdown menu
  expect(enzymeWrapper.find('#testId-competitionOneButton')).toHaveLength(1); //competition one button
  expect(enzymeWrapper.find('#testId-competitionTwoButton')).toHaveLength(1); //competition two button
  expect(enzymeWrapper.find('#testId-cohortDropDownOptions')).toHaveLength(3); //cohort dropdown options
  //check that now length is 5
}); 