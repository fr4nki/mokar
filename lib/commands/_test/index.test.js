require('jest');

import Index from '../index';

describe('Init function', () => {
    beforeEach(() => {
        return (
            console.log = () => {}
        )
    });

    it('works correctly with exists action name', () => {
        const { init } = Index;

        expect(init('run')).toEqual({ run: expect.any(Function) });
    });

    it('works correctly with exists action name and passed params', () => {
        const { init } = Index;

        expect(init('run', ['--help'])).toEqual({ run: expect.any(Function) });
    });

    it('works correctly without passing action', () => {
        const { init } = Index;

        expect(init()).toEqual({ run: expect.any(Function) });
    });

    it('works correctly with wrong action name', () => {
        const { init } = Index;

        expect(init('foo')).toBeTruthy();
    });
});
