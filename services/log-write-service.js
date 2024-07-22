const pathsave = "../logs";

module.exports = () => {
	let ctx = {};
	
	ctx.init = () => {
		console.log(`Initialization: Log Write Service - pathsave: ${pathsave}`);
	};
	
	return ctx;
}