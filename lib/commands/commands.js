const { log, logTypes } = require('../utils/logs');
const commands = {
    help: require('./help'),
    run: require('./run'),
};

const init = (action, params) => {
    let currentAction = action;
    const defaultAction = 'help';
    const initReturn = { run: () => {} };

    if (!action && !params.length) {
        currentAction = defaultAction;
    }

    const current = commands[currentAction];

    if (!current) {
        log(logTypes.err, `Passed action does not exists. Use 'help' to see more information.`);
        return initReturn;
    }

    const { check, settings }= current.checkParams(params);

    if (check) {
        initReturn.run = current.action(settings);
    }

    return initReturn;
};

module.exports = {
    init,
};
