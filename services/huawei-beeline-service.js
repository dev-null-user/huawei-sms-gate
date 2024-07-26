require('dotenv').config();

const fetch 			= (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const dateFormat		= require('date-format');
const convertXmlJson	= require('xml-js');

const host = process.env.HUAWEI_MODEM_HOST;
const port = process.env.HUAWEI_MODEM_PORT;

module.exports = () => {
	let ctx 		= {};
	
	let baseRoute 		= '';
	let token 			= '';
	let logWriteService = null;
	
	// get token of device modem
	ctx.getToken = async () => {
		let result = await ctx.request('GET', 'api/webserver/token');
		
		if (result) {
			try {
				result = convertXmlJson.xml2json(result);
				result = JSON.parse(result);
				
				if (result && result.elements[0].elements[0].elements[0]) {
					return result.elements[0].elements[0].elements[0].text;
				}

			} catch (e) {
				logWriteService.write(e);
			}
			
			return null;
		}

		return null;
	};
	
	// send message on phone after get token
	ctx.sendMessage = async(phone, message) => {
		token = await ctx.getToken();

		let packageXml = () => {
			return `
				<?xml version="1.0" encoding="UTF-8"?>
				<request>
					<Index>-1</Index>
					<Phones>
						<Phone>${phone}</Phone>
					</Phones>
					<Sca></Sca>
					<Content>${message}</Content>
					<Length>10</Length>
					<Reserved>0</Reserved>
					<Date>${dateFormat('yyyy-MM-dd hh:mm:ss')}</Date>
				</request>
			`;
		}
		
		let result = await ctx.request('POST','api/sms/send-sms', packageXml());

		if (result) {
			try {
				result = convertXmlJson.xml2json(result);
				result = JSON.parse(result);

				if (result && result.elements[0].elements[0] && result.elements[0].elements[0].text == 'OK') {
					return true;
				}

			} catch (e) {
				logWriteService.write(e);
			}
			
			return false;
		}

		return false;
	};
	
	ctx.request = async (_method, api, bodyXml = null) => {
		
		let _options = {method: _method, headers: {'Content-Type': 'application/xml'}};
		
		if (token != '') {
			_options.headers['__RequestVerificationToken'] = token;
		}		
		
		if (bodyXml) {
			_options.body = bodyXml;
		}

		let randomName = logWriteService.randomHash();
		
		logWriteService.write(`${randomName} | Huawei Beeline Service - request - ${JSON.stringify({'api': baseRoute + ('/' + api), options: _options})})`);
		
		const response = await fetch(baseRoute + ('/' + api), _options);
		const data 	   = await response.text();
		
		logWriteService.write(`${randomName} | Huawei Beeline Service - response - ${JSON.stringify(data)}`);
		
		return data;
	};
	
	ctx.init = (_logWriteService) => {
		baseRoute = `http://${host + (port != '' ? (':' + port) : '')}`;
		
		logWriteService = _logWriteService
		logWriteService.write(`Initialization: Huawei Beeline Service - api: ${baseRoute}`);
	};
	
	return ctx;
}