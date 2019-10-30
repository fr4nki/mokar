const actions = require('./actions/actions');
const cli = require('./utils/cli');

const { action, params } = cli.parse();

actions.init(action, params).run();
