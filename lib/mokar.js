const commands = require('./commands/commands');
const cli = require('./utils/cli');

const { action, params } = cli.parse();

commands.init(action, params).run();
