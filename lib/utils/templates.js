const mapFileNametoMimeType = (filename) => {
    const extension = filename.split('.')[1];
    const defaultMimeType = 'application/octet-stream';

    const mimeTypes = {
        'json': 'application/json',
        'png':  'image/png',
        'jpeg': 'image/jpeg',
        'jpg':  'image/jpeg',
        'gif':  'image/gif',
        'svg':  'image/svg+xml',
        'txt':  'text/plain',
        'html': 'text/html',
        'js':   'text/javascript',
        'css':  'text/css',
        'mpeg': 'audio/mpeg',
        'mp3':  'audio/mpeg',
        'wav':  'audio/wav',
        'ogg':  'audio/ogg',
        'mp4':  'video/mp4',
    };

    return mimeTypes[extension] || defaultMimeType;
};


const getMethodFromString = (name) => {
    const result = {
        filename: name,
        method: 'all',
    };

    if (typeof name !== 'string') {
        return name;
    }

    const methods = {
        '[all]': 'all',
        '[get]': 'get',
        '[head]': 'head',
        '[post]': 'post',
        '[put]': 'put',
        '[delete]': 'delete',
        '[patch]': 'patch',
    };

    Object.keys(methods).forEach((m) => {
        if (result.filename.toLowerCase().startsWith(m)) {
            const regexp = new RegExp(`\\[${methods[m]}\\]`, 'gi');

            result.method = methods[m];
            result.filename = result.filename.replace(regexp, '');
        }
    });

    return result;
};

const getFilterFromString = (name) => {
    console.log(name, typeof name)
    if (typeof name !== 'string') {
        return name;
    }

    const template = {
        'any': '[a-zA-Z0-9_-]',
        'number': '[0-9]',
        'string': '[a-zA-Z]',
    };

    return name;
};

module.exports = {
    mapFileNametoMimeType,
    getMethodFromString,
    getFilterFromString,
};
