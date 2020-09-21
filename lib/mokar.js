const commands = require('./commands');
const cli = require('./utils/cli');

const { action, params } = cli.parse(process.argv);

commands.init(action, params).run();
