const AppError = require('../utils/appError');


module.exports = function (app) {
    try {
        app.get('/:model/:action', async (req, res, next) => {
            let modelName = req.params.model;
            const command = req.params.action;
            try{
              var module = require("../controllers/" + modelName + "Controller");
              module[command](req, res, next);
            } catch(e){
                return res.status(406).json({
                    "response_code": 406,
                    "error": {
                        messsage: "Invalid request"
                    }
                });
            }
        })


        app.all('/api/v1/:model/_/:command/*', (req, res, next) => {
            res.status(404).json({status: "error", message: `Can't find ${req.originalUrl} on this server!`});
        });
        app.all('/api/v1/:model/*', (req, res, next) => {
            res.status(404).json({status: "error", message: `Can't find ${req.originalUrl} on this server!`});
        });
        app.all('/api/v1/:model/:id/*', (req, res, next) => {
            res.status(404).json({status: "error", message: `Can't find ${req.originalUrl} on this server!`});
        });

    } catch (e) {
        res.status(404).json({status: "error", message: `Can't find ${req.originalUrl} on this server!`});
    }
}