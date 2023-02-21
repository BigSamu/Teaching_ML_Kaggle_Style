import React from 'react';
import { shallow } from 'enzyme';
import App from './App.js';

jest.mock('react-redux', () => ({
  useSelector: () => ({
    auth: 'token', //replace with dictionaries
  }),
}));

test('App.js renders without crashing', () => {
 shallow(<App />);
});