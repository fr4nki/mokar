const parse = () => {
    const arguments = process.argv.slice(2);
    const params = arguments.slice(1);
    const action = arguments[0];

    return { action, params }
}

module.exports = {
    parse,
}
