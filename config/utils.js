const path = require('path');

exports.resolve = (dir) => path.join(__dirname, '..', dir);
exports.APP_PATH = exports.resolve ('src');
exports.DIST_PATH = exports.resolve ('dist');

