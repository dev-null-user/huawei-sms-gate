const pathsave 	= "./logs";
const fs 		= require('fs');

module.exports = () => {
	let ctx = {};
	let filename = '';
	
	ctx.write = (message, tag = null) => {
		if (filename != '') {
			
			message = ('\n') + (tag ? tag + ': ' : '') + message;
			
			fs.appendFile(`./${pathsave}/${filename}.log`, message, (err) => {
			  if (err) {
				 console.log('Log Write Service - err: ', err);
			  };
			  console.log(message)
			});
		}
	};
	
	ctx.init = () => {
		filename = Date.now();
	};
	
	return ctx;
}