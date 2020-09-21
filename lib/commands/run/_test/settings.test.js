require('jest');

const settings = require('../settings');

describe('Settings for Run action', () => {
    it('working correctly without passed params', () => {
        expect(settings()).toEqual({ checked: true, settings: {} });
    });

    it('working correctly with passed help argument', () => {
        expect(settings(['--help'])).toEqual({ checked: false, settings: {} });
    });

    it('working correctly with unsupported arguments', () => {
        const expectation = {
            checked: true,
            settings: {
                delay: 50,
                mocks: [
                    {
                        from: "./mocks",
                        prefix: "/",
                    },
                ],
                port: 9990,
                saveExtension: false,

            }
        };

        expect(settings(['foo'])).toEqual(expectation);
    });

    it('working correctly with all passed types of arguments', () => {
        const expectation = {
            checked: true,
            settings: {
                delay: 10,
                mocks: [
                    {
                        from: '/mocks/',
                        prefix: '/api/v1',
                    },
                ],
                port: 9999,
                saveExtension: true,

            }
        };

        expect(settings(['-d=10', '--mocks=/mocks/:api/v1', '-p=9999', '-se'])).toEqual(expectation);
    });
});
