/*
	Name: Sms-gate
	Author: Sanarov Mihail
	Telegram: https://t.me/devnulluser
*/

require('dotenv').config();

const express = require('express');
const dateFormat = require('date-format');


const logWriteService 		= require('./services/log-write-service')();
const huaweiBeelineService  = require('./services/huawei-beeline-service')();
const csvService			= require('./services/csv-service')();
const listenerService 		= require('./services/listener-service')();
const appRoutes 			= require('./routes');

const host = process.env.APP_HOST;
const port = process.env.APP_PORT;

const app = express();

appRoutes(app).init({logWriteService, huaweiBeelineService, csvService})

let initServices = () => {
	logWriteService.init();
	csvService.init();
	huaweiBeelineService.init(logWriteService);
	listenerService.init(logWriteService, huaweiBeelineService, onNewMessages)
}

let onNewMessages = async (messages) => {
	for (item of messages) {
		if (new Date(item.datetime).getDate() != new Date().getDate()) {
			continue;
		}
		if(await huaweiBeelineService.setReadMsg(item.index)) {
			csvService.appendRow(item.phone, item.message, 'in', item.datetime);
			logWriteService.write(`Incoming message | phone - ${item.phone} | date - ${item.datetime} | msg - ${item.message}`);
		}
	}
}

app.listen(port, host, async () => {
	initServices();
	logWriteService.write(`Sms-Gate started. http://${host}:${port}`);
});
