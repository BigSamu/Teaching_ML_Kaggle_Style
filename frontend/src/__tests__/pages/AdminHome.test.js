import React from 'react';
import { shallow } from 'enzyme';
import AdminHome from '../../pages/AdminHome';

test('component AdminHome renders without crashing', () => {
 shallow(<AdminHome />);
});