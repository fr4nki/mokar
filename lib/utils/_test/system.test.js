require('jest');

const path = require('path');
const fs = require('fs');
const system = require('../system');

describe('System modules testing', () => {
    it('fileIsHidden working correctly', () => {
        const source = '.foo.bar';

        expect(system.fileIsHidden(source)).toEqual(true);
    });

    it('checkPermissionToRead with exists path', () => {
        const p = path.join(__dirname, './system.test.js');
        expect(system.checkPermissionToRead(p)).toEqual(true);
    });

    it('checkPermissionToRead with exists not path', () => {
        const p = path.join('/etc/passwd');
        expect(system.checkPermissionToRead(p, fs.constants.W_OK)).toEqual(false);
    })
});
