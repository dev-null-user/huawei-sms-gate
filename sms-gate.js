/*
	Name: Sms-gate
	Author: Sanarov Mihail
	Telegram: https://t.me/devnulluser
*/

require('dotenv').config();

const express = require('express');

const logWriteService 		= require('./services/log-write-service')();
const huaweiBeelineService  = require('./services/huawei-beeline-service')();
const appRoutes 			= require('./routes');

const host = process.env.APP_HOST;
const port = process.env.APP_PORT;

const app = express();

appRoutes(app).init({logWriteService, huaweiBeelineService})

let initServices = () => {
	logWriteService.init();
	huaweiBeelineService.init(logWriteService);
}

app.listen(port, host, async () => {
	initServices();
	logWriteService.write(`Sms-Gate started. http://${host}:${port}`);
});
