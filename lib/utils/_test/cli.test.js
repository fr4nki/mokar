require('jest');

const { parse } = require('../cli');

describe('CLI args', () => {
    it('works with empty argv', () => {
        const cliEmpty = [
            '/Users/temp/node',
            '/Users/temp/mokar/node_modules/mokar/bin/mokar.js'
        ];

        const parsed = parse(cliEmpty);

        expect(parsed).toEqual({ action: undefined, params: [] });
    });

    it('works with many argv params', () => {
        const cliEmpty = [
            '/Users/temp/node',
            '/Users/temp/mokar/node_modules/mokar/bin/mokar.js',
            'mock',
            '-p',
            '--something',
        ];

        const parsed = parse(cliEmpty);

        expect(parsed).toEqual({ action: 'mock', params: ['-p', '--something'] });
    });
});
