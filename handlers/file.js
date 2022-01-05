'use strict';
var dataProvider = require('../data/file.js');
/**
 * Operations on /file
 */
module.exports = {
    /**
     * summary: 
     * description: 
     * parameters: directory, env, host, port, fileName, file
     * produces: application/json
     * responses: 200, 500
     */
    post: function postFile(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['post']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
