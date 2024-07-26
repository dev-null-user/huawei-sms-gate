const pathsave 		= "./logs";
const fs 			= require('fs');
const dateFormat	= require('date-format');

module.exports = () => {
	let ctx = {};
	let filename = '';
	
	ctx.write = (message, tag = null) => {
		if (filename != '') {

			if (filename != dateFormat('yyyy-MM-dd', new Date())) {
				ctx.init();
			}
			
			message = ('\n') + (`[${dateFormat('yyyy-MM-dd hh:mm:ss', new Date())}] `) + (tag ? tag + ': ' : '') + message;
			
			fs.appendFile(`./${pathsave}/${filename}.log`, message, (err) => {
			  if (err) {
				 console.log('Log Write Service - err: ', err);
			  };
			  console.log(message)
			});
		}
	};

	ctx.randomHash = (length = 14) => {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
		  counter += 1;
		}
		return result;
	}
	
	ctx.init = () => {
		filename = dateFormat('yyyy-MM-dd', new Date());
	};
	
	return ctx;
}