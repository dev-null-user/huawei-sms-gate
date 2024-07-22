/*
	Name: Sms-gate
	Author: Sanarov Mihail
*/

const express = require('express');

const huaweiBeelineService  = require('./services/huawei-beeline-service')();
const logWriteService 		= require('./services/log-write-service')();

const host = '192.168.17.145';
const port = 3435;

const app = express();

app.listen(port, host, () => {
	huaweiBeelineService.init();
	logWriteService.init();
	
	console.log(`Sms gate started. http://${host}:${port}`);
});
