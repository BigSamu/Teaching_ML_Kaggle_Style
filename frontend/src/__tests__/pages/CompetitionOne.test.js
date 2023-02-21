import React from 'react';
import { shallow } from 'enzyme';
import CompetitionOne from '../../pages/CompetitionOne';

const enzymeWrapper = shallow(<CompetitionOne />);

test('component CompetitionOne renders without crashing', () => {
 expect(enzymeWrapper.exists()).toBe(true);
});