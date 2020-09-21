require('jest');

const settings = require('../settings');

describe('Settings for Help action', () => {
    it('working correctly', () => {
        expect(settings()).toEqual({ checked: true, settings: {} });
    });
});
