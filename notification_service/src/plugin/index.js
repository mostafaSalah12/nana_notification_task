const Package = require('../../package.json');
const routes = require("./routes");

async function register(server) {
  routes(server)
}

const Plugin = {
  name: `${Package.name}/notification`,
  version: Package.version,
  register,
}

module.exports = Plugin