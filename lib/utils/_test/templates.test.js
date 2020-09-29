require('jest');

const templates = require('../templates');

describe('mapFileNametoMimeType', () => {
    it('works with declared extension', () => {
        const filename = 'some.jpg';
        const result = { extension: 'jpg', filename: 'some', mime: 'image/jpeg' };

        expect(templates.mapFileNametoMimeType(filename)).toEqual(result);
    });

    it('works with unknown extension', () => {
        const filename = 'some.thing';
        const result = { extension: 'thing', filename: 'some', mime: 'application/octet-stream' };

        expect(templates.mapFileNametoMimeType(filename)).toEqual(result);
    });
});

describe('getMethodFromString', () => {
    it('works with passed method', () => {
        const filename = '[post]some.jpg';
        const result = { filename: 'some.jpg', method: 'post' };

        expect(templates.getMethodFromString(filename)).toEqual(result);
    });

    it('works without passed method', () => {
        const filename = 'some.jpg';
        const result = { filename: 'some.jpg', method: 'all' };

        expect(templates.getMethodFromString(filename)).toEqual(result);
    });
});

describe('getFilterFromString', () => {
    it('works with passed with "number" filter and length from 1 to 3', () => {
        const endpoint = 'foo?id={number#1,3}';
        const result = '^foo\\?id=[0-9]{1,3}$';

        expect(templates.getFilterFromString(endpoint)).toEqual(result);
    });

    it('works with passed with "number" filter and without length', () => {
        const endpoint = 'foo?id={number}';
        const result = '^foo\\?id=[0-9]+$';

        expect(templates.getFilterFromString(endpoint)).toEqual(result);
    });

    it('works with passed with "any" filter and length from 1 to 5', () => {
        const endpoint = 'foo?id={any#,5}';
        const result = '^foo\\?id=[a-zA-Z0-9_-]{1,5}$';

        expect(templates.getFilterFromString(endpoint)).toEqual(result);
    });

    it('works correctly without filter substring', () => {
        const endpoint = 'foo?id=5';
        const result = '^foo\\?id=5$';

        expect(templates.getFilterFromString(endpoint)).toEqual(result);
    });
});
