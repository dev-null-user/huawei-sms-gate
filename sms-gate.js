/*
	Name: Sms-gate
	Author: Sanarov Mihail
*/

const express = require('express');

const logWriteService 		= require('./services/log-write-service')();
const huaweiBeelineService  = require('./services/huawei-beeline-service')();

const host = '192.168.17.145';
const port = 3435;

const app = express();

app.listen(port, host, async () => {
	logWriteService.init();
	huaweiBeelineService.init(logWriteService);
	
	logWriteService.write(`Sms gate started. http://${host}:${port}`);
	
	console.log(await huaweiBeelineService.getToken());
});
