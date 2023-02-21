import React from 'react';
import { shallow } from 'enzyme';
import CompetitionTwo from '../../pages/CompetitionTwo';

test('component CompetitionTwo renders without crashing', () => {
 shallow(<CompetitionTwo />);
});