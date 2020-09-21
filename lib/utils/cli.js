const parse = (argv) => {
    const args = argv.slice(2);
    const params = args.slice(1);
    const action = args[0];

    return { action, params }
};

module.exports = {
    parse,
};
