require('jest');

const logs = require('../logs');

describe('Logs utils modules', () => {
    let mockedOuput = [];

    beforeEach(() => {
        mockedOuput = [];

        return (
            console.log = (...arg) => {
                mockedOuput.push(...arg);
            }
        )
    });

    it('logspacer works', () => {
        const result = '#####';

        expect(logs.logSpacer('#', 5)).toEqual(result);
    });

    it('loglist works', () => {
        logs.logList(['foo','bar']);

        expect(mockedOuput).toEqual(['', '  foo', '', '  bar']);
    });

    it('log works without passed logtypes', () => {
        logs.log('foo', logs.logTypes.err);

        expect(mockedOuput).toEqual(['Error', 'foo']);
    });

    it('log works with passed array', () => {
        logs.log(['foo', 'bar']);

        expect(mockedOuput).toEqual(['', 'foobar']);
    });
});
