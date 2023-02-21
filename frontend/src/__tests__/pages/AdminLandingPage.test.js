import React from 'react';
import { shallow } from 'enzyme';
import AdminLandingPage from '../../pages/AdminLandingPage.js';
import AdminLoginForm from '../../components/AdminLoginForm.js';

const enzymeWrapper = shallow(<AdminLandingPage />);

test('component AdminLandingPage renders without crashing', () => {
    shallow(<AdminLandingPage />);
});

test('component AdminLandingPage renders component AdminLoginForm', () => {
    // Setup wrapper and assign props.
    shallow(<AdminLandingPage />);
    // enzymeWrapper.find(selector) : Find every node in the render tree that matches the provided selector. 
    expect(enzymeWrapper.containsMatchingElement(<AdminLoginForm />)).toEqual(true);
});