const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const host = '192.168.8.1';
const port = '';

module.exports = () => {
	let ctx = {};
	
	let baseRoute = '';
	
	ctx.init = () => {
		baseRoute = `http://${host + (port != '' ? (':' + port) : '')}`;
		
		console.log(`Initialization: Huawei Beeline Service - api: ${baseRoute}`);
	};
	
	return ctx;
}