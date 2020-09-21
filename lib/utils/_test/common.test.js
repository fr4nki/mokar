require('jest');

const common = require('../common');

describe('Common utils modules', () => {
    it('flatArray with arguments', () => {
        const source = [1, 2, [3, undefined], 'foo'];
        const result = [1, 2, 3, undefined, 'foo'];

        const arrayFlat = common.flatArray(source);

        expect(arrayFlat).toEqual(result);
    });

    it('flatArray without arguments', () => {
        const source = null;
        const expectation = common.flatArray(source);
        const reality = [];

        expect(expectation).toEqual(reality);
    });

    it('escapePathForRegexp works correctly', () => {
        const source = '/foo/bar?id=1';
        const result = '\\/foo\\/bar\\?id=1';

        const escaped = common.escapePathForRegexp(source);

        expect(escaped).toEqual(result);
    });

    it('mergeObjectDeep', () => {
        const source1 = {a: { b: 1, c: 1}};
        const source2 = {a: { b: 1, c: 2}, f: 3};
        const result = {a: { b: 1, c: 2}, f: 3};

        expect(common.mergeObjectsDeep(source1, source2)).toEqual(result);
    });

    it('addMissingPrefix', () => {
        const source = 'foo';
        const result = '/foo';

        expect(common.addMissingPrefix('/', ['/'], source)).toEqual(result);
    });

    it('normalizeMockPaths', () => {
       const type = 'mocks';
       const source = 'mocks/:api/v1';

       expect(common.normalizeMockPaths(type, source)).toEqual([{from: "./mocks/", prefix: "/api/v1"}])
    });

    it('normalizeMockPaths2', () => {
        const type = 'notmocks';
        const source = './foo';

        expect(common.normalizeMockPaths(type, source)).toEqual(source)
    });
});
