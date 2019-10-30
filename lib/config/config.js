const path = require('path');
const fs = require('fs');
const { log, logTypes } = require('../utils/logs');
const { merge } = require('../utils/common');

const defaults = {
    delay: 200,
    port: 9990,
    watch: true,
    mocks: {
        'mocks': '/',
    },
    template: {
        method: ['[', ']'],
        filter: ['{', '}'],
    },
};

const get = () => new Promise((resolve) => {
    // Lapti.rc - what a fun
    const filesData = [];
    const files = [
        { name: '.mokarrc', key: null },
        { name: 'package.json', key: 'mokar' },
        { name: '.laptirc', key: null },
    ];

    files.forEach((file) => {
        filesData.push(
            new Promise((fileResolve) => {
                const { name, key } = file;
                let data = null;

                fs.readFile(path.resolve(name), (readError, readData) => {
                    if (readData) {
                        const dataString = readData.toString();

                        try {
                            const dataJSON = JSON.parse(dataString);
                            data = key ? dataJSON[key] : dataJSON;
                        } catch(e) {}

                        fileResolve({ name, data});
                    } else {
                        fileResolve({ name, data});
                    }
                })
            })
        )
    })

    Promise.all(filesData)
        .then((data) => {
            let readErrors = 0
            let config = defaults

            files.forEach((file) => {
                const current = data.filter(d => d.name === file.name)[0]

                if (!current || !current.data) {
                    readErrors += 1
                } else {
                    config = current.data
                }
            })

            if (readErrors === data.length) {
                log(logTypes.wrn, 'Cannot read user config, using default.')
            }

            resolve(merge(defaults, config))
        })
})

module.exports = {
    get,
}
