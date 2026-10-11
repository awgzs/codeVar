'use strict';

const config = require('./src/config');
const style = require('./src/style');

(function () {
    var params = config.getParams();
    if (params) {
        style.core(config.youDaoApi, params, style.namedConst);
    }
})();