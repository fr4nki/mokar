require('jest');

const action = require('../action');

describe('Action for Help action', () => {
    let mockedOuput = [];

    beforeEach(() => {
        mockedOuput = [];

        return (
            console.log = (...arg) => {
                mockedOuput.push(...arg);
            }
        )
    });

    it('working correctly', () => {
        expect(action()()).toEqual(undefined);
    });
});
