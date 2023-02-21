import React from 'react';
import { shallow } from 'enzyme';
import AdminLoginForm from '../../components/AdminLoginForm';
import { MemoryRouter } from 'react-router-dom';



jest.mock("react-redux", () => ({
    useDispatch: () => {}
}));

let [handleFormFieldChange, handleSubmit, setFormIsNotFilledIn] = new Array(3).fill(jest.fn());
const props = {
    handleFormFieldChange: handleFormFieldChange,
    handleSubmit: handleSubmit
}

//const enzymeWrapper = shallow(<MemoryRouter> <AdminLoginForm {...props}/> </MemoryRouter>); //memory router is used to handle useLocation() -> https://reactrouter.com/web/guides/testing
const enzymeWrapper = shallow(<AdminLoginForm {...props}></AdminLoginForm>);

test('component AdminLoginForm renders without crashing', () => {
    expect(enzymeWrapper.exists()).toBe(true);
}); 


test('component AdminLoginForm renders <form>', () => {
    expect(enzymeWrapper.find('#testId-formIsNotFilledInErrorMessage')).toHaveLength(0);
    expect(enzymeWrapper.find('#testId-formAdminLoginForm')).toHaveLength(1);
}); 

