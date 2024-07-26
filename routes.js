require('dotenv').config();

const apiKey = process.env.API_KEY;

const STATUS_ERROR   = -1;
const STATUS_SUCCESS = 0;


module.exports = (app) => {
    let ctx = {};
    
    app.get(`/`, async (req, res) => {
        res.send('ok')
    });
    
    app.get(`/${apiKey}/send`, async (req, res) => {
        if (req.query.phone) {

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

            return res.send({'status': STATUS_SUCCESS});
        }
    });

    ctx.init = (services) => {
        for(let key in services) {
            ctx[key] = services[key];
        }
    }

    return ctx;
}