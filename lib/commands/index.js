const { log, logTypes } = require('../utils/logs');

const commands  = {
    help: require('./help'),
    run: require('./run'),
};


const init = (action, params) => {
    let currentAction = action;
    const defaultAction = 'help';
    const initReturn = {
        run: () => {
        }
    };

    if (!action) {
        currentAction = defaultAction;
    }

    const current = commands[currentAction];

    if (!current) {
        log(logTypes.err, `Passed action does not exists. Use 'help' to see more information.`);
        return initReturn;
    }

    const {checked, settings} = current.settings(params);

    if (checked) {
        initReturn.run = current.action(settings);
    }

    return initReturn;
};

module.exports = {
    init,
};
