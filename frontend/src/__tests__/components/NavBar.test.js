import React from 'react';
import { shallow } from 'enzyme';
import NavBar from '../../components/NavBar';

jest.mock('react-redux');

let handleAuthLogoutDispatcher = new Array(1).fill(jest.fn());
const props = {
    isAdminAuthenticated: false,
    handleAuthLogoutDispatcher: handleAuthLogoutDispatcher
}
const enzymeWrapper = shallow(<NavBar {...props} />)


test('component NavBar renders without crashing', () => {
    expect(enzymeWrapper.exists()).toBe(true);
});

test('component NavBar adjusts render based on (auth) props correctly', () => {
    expect(enzymeWrapper.find('#testId-logoutButtonNavbar')).toHaveLength(0); 

    //expect(enzymeWrapper.find('#testId-logoutButtonNavbar').text()).toBe("Logout"); //cohort dropdown options
    props.isAdminAuthenticated = true;
    expect(shallow(<NavBar {...props} />).find('#testId-logoutButtonNavbar')).toHaveLength(1); //now that isAdminAuthenticated is true the navbar should display the logout button

});