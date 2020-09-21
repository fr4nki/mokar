require('jest');

const http = require('http');
const events = require('events');

const settingsObject = require('../settings');

const action = require('../action');

const req = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, response => {
            const {statusCode} = response;

            let data = '';
            response.on('data', _data => data += _data);
            response.on('end', () => resolve({data, statusCode}));
            response.on('error', () => reject());
        });
    });
}

describe('Action for Run', () => {
    afterAll(done => {
        done();
    });

    it('200 on existed endpoint with default settings', async (done) => {
        try {
            const {settings} = settingsObject([]);
            action(settings)();

            const { statusCode } = await req('http://localhost:9990//f/foo');

            expect(statusCode).toEqual(200);
            done();
        } catch(error) {
            done(error);
        }
    });

    it('404 on non existed endpoint', async (done) => {
        try {
            const {settings} = settingsObject([]);
            action(settings)();

            const { statusCode } = await req('http://localhost:9990/404');

            expect(statusCode).toEqual(404);
            done();
        } catch(error) {
            done(error);
        }
    });

    it('200 on existed endpoint with cli mocks path', async (done) => {
        try {
            const {settings} = settingsObject(['--mocks=./mocks:/api']);
            action(settings)();

            const { statusCode } = await req('http://localhost:9990/api/f/foo');

            expect(statusCode).toEqual(200);
            done();
        } catch(error) {
            done(error);
        }
    });
});
