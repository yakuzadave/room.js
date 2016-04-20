const onExit = require('../lib/on-exit');
const MooDB = require('../lib/moo-db');

const db = new MooDB('state/world');
const save = () => db.saveSync();

onExit(save);
setInterval(save, 30 * 60 * 1000); // every 30 minutes

module.exports = db;
