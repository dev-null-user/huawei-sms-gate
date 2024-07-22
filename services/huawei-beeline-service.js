const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const host = '192.168.8.1';
const port = '';

module.exports = () => {
	let ctx 		= {};
	
	let baseRoute 		= '';
	let token 			= '';
	let logWriteService = null;
	
	// get token of device modem
	ctx.getToken = async () => {
		return await ctx.request('GET','api/webserver/token');
	};
	
	// send message on phone after get token
	ctx.sendMessage = async(phone, message) => {
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
					<Date>2024-07-22 20:30:50</Date>
				</request>
			`;
		}
		
		return await ctx.request('GET','api/webserver/token', packageXml());
	};
	
	ctx.request = async (_method, api, bodyXml = null) => {
		
		let _options = {method: _method, headers: {'Content-Type': 'application/xml'}};
		
		if (token != '') {
			_options.headers['__RequestVerificationToken'] = token;
		}		
		
		if (bodyXml) {
			options.body = bodyXml;
		}
		
		logWriteService.write(`Huawei Beeline Service - request - ${JSON.stringify({'api': baseRoute + ('/' + api), options: _options})})`);
		
		const response = await fetch(baseRoute + ('/' + api), _options);
		const data 	   = await response.text();
		
		logWriteService.write(`Huawei Beeline Service - response - ${JSON.stringify(data)}`);
		
		return data;
	};
	
	ctx.init = (_logWriteService) => {
		baseRoute = `http://${host + (port != '' ? (':' + port) : '')}`;
		
		logWriteService = _logWriteService
		logWriteService.write(`Initialization: Huawei Beeline Service - api: ${baseRoute}`);
	};	
	
	return ctx;
}