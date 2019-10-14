const path = require('path')
const fs = require('fs')

const { log } = require('./logs')

const mimeType = (type) => (
    {
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.mpeg': 'audio/mpeg',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.mp4': 'video/mp4',
    }[type]
)

const tree = function(dir, prefix, pre) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(function(filename) {
        const file = dir + '/' + filename;
        const stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(tree(file, prefix, pre + '/' + filename));
        } else {
            const ext = path.extname(file)
            const fileWOExt = filename.replace(ext, '')
            // TODO: Add check for Win32 and this should be tested
            const cleanFilename = fileWOExt.replace(/:/g, '/')
            const endpoint = (prefix + pre + '/' + cleanFilename).split('/').filter(txt => txt.trim() !== '')

            console.log(cleanFilename)

            results.push({
                contentType: mimeType(ext),
                query: '',
                endpoint: '/' + endpoint.join('/'),
                file,
            });
        }
    });
    return results;
}

const getStructure = (rootPath, from) => {
    console.log(rootPath)
    console.log(from)

    const keys = Object.keys(from)

    const arr = keys.map((prefix) => {
        const path = rootPath + '/' + from[prefix]

        return tree(path, prefix, '')
    })


    console.log(arr)
}

module.exports = {
    getStructure,
}
