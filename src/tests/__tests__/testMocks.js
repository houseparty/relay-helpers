/* @noflow */
import React from 'react';
import Relay from 'react-relay';
import withRelayQuery from '../../components/decorators/withRelayQuery';
import {shallow} from 'enzyme';
import {createMockRelayEnv} from '../mocks';


jest.mock('react-relay', () => {
    return require('../mocks').Relay;
});


describe('mocks', () => {
    describe('Relay Renderer', () => {
        function TestComponent() {}
        const Wrapper = withRelayQuery({
            query: Relay.QL`
                query {
                    user(id: $userId) {
                        username
                    }
                }
            `
        })(TestComponent);

        var context;

        beforeEach(() => {
            Relay.Renderer.nextRenderResult = {};
            context = {relayEnv: createMockRelayEnv()};
        });

        it('should be possible to use it to provide a loading state to a component', () => {
            const wrapper = shallow(<Wrapper userId="user1" />, {context});
            const inner = shallow(wrapper.node, {context});
            expect(inner.props().loading).toBe(true);
        });

        it('should be possible to use it to provide an error state to a component', () => {
            Relay.Renderer.nextRenderResult = {error: new Error()};
            const wrapper = shallow(<Wrapper userId="user1" />, {context});
            const inner = shallow(wrapper.node, {context});
            expect(inner.props().error).toBeTruthy();
        });

        it('should be possible to use it to provide an offline state to a component', () => {
            Relay.Renderer.nextRenderResult = {offline: true};
            const wrapper = shallow(<Wrapper userId="user1" />, {context});
            const inner = shallow(wrapper.node, {context});
            expect(inner.props().offline).toBe(true);
        });

        it('should be possible to use it to provide a data to a component', () => {
            Relay.Renderer.nextRenderResult = {props: {user: {username: 'testusername'}}};
            const wrapper = shallow(<Wrapper userId="user1" />, {context});
            const inner = shallow(wrapper.node, {context});
            expect(inner.props().user).toEqual({username: 'testusername'});
        });
    });
});
