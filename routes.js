require('dotenv').config();

const dateFormat = require('date-format');
const csvToJson  = require('csvtojson/v2');

const apiKey = process.env.API_KEY;

const STATUS_ERROR   = -1;
const STATUS_SUCCESS = 0;


module.exports = (app) => {
    let ctx = {};

    app.use((req, res, next) => {
        res.on('finish', () => {
            ctx.logWriteService.write(
                `Request API | IP Address ${req.headers['x-forwarded-for'] || req.socket.remoteAddress } | request headers - ${JSON.stringify(req.rawHeaders)}] | request params - ${JSON.stringify(req.query)}`, 
                ctx.logWriteService.randomHash()
            );
        });
        next();
    });
    
    app.get(`/`, async (req, res) => {
        // await ctx.huaweiBeelineService.setReadMsg(40050);
        // console.log(await ctx.huaweiBeelineService.getNewMessages());

        return res.send({status: STATUS_SUCCESS})
    });

    app.get(`/${apiKey}/report`, async (req, res) => {
        // ctx.csvService.readRowsByDate(req.query.date, (_result) => {
            // if (_result) {
            //     res.writeHead(200, {
            //         'Content-Type': 'text/csv',
            //         'Content-Disposition': `attachment; filename=report-${req.query.date ? req.query.date : dateFormat('dd-MM-yyyy', new Date())}.csv`
            //     });
            //     res.end(_result);
            //     return;
            // }

        //     return res.send({'status': STATUS_ERROR, 'message': 'Not found file'});
        // });
        
        ctx.csvService.getPathOnFile(req.query.date, (req.query.direction || 'out'), (_result) => {
            if (_result) {
                csvToJson().fromFile(_result)
                .then((jsonObj) => {
                    ctx.csvService.resetCsv(_result);
                    return res.send({'status': STATUS_SUCCESS, 'message': '', data: jsonObj});
                })
                .catch((err) => {
                    let errMess = `Routes error: don\'t read format csv to json | path to file - ${_result}`;
                    ctx.logWriteService.write(errMess);
                    return res.send({status: STATUS_ERROR, message: errMess});
                });
                return;
            }

            return res.send({'status': STATUS_ERROR, 'message': 'Not found file'});
        })
    });
    
    app.get(`/${apiKey}/send`, async (req, res) => {
        if (!req.query.phone || req.query.phone == '') {
            return res.send({'status': STATUS_ERROR, 'message': 'Empty phone'});
        }

        if (!req.query.message || req.query.message == '') {
            return res.send({'status': STATUS_ERROR, 'message': 'Empty message'});
        }
        
        let phone = req.query.phone.replace(/\ |\-|\+/g, '').replace(/^7/g, '8');

        if (phone.length < 11) {
            return res.send({'status': STATUS_ERROR, 'message': 'Short send phone'});
        }

        ctx.huaweiBeelineService.sendMessage(phone, req.query.message);
        ctx.csvService.appendRow(phone, req.query.message);

        return res.send({'status': STATUS_SUCCESS});
    });

    ctx.init = (services) => {
        for(let key in services) {
            ctx[key] = services[key];
        }
    }

    return ctx;
}