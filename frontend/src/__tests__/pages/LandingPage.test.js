import React from 'react';
import { shallow } from 'enzyme';
import LandingPage from '../../pages/ClientLandingPage';

test('component LandingPage renders without crashing', () => {
 shallow(<LandingPage />);
});