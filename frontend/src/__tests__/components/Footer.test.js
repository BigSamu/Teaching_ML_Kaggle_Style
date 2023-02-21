import React from 'react';
import { shallow } from 'enzyme';
import Footer from '../../components/Footer';

const enzymeWrapper = shallow(<Footer />);
test('component Footer renders without crashing', () => {
 expect(enzymeWrapper.exists()).toBe(true);
});