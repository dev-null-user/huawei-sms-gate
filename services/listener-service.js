const RELOAD_TIME_SECONDS = 30;

module.exports = () => {
    let ctx = {};
    let timeoutObj = null;

    ctx.reloadTime = async () => {
        await ctx.getRequest();
        if (timeoutObj) clearTimeout(timeoutObj);
        timeoutObj = setTimeout(ctx.reloadTime, 1000 * RELOAD_TIME_SECONDS);
    }

    ctx.getRequest = async () => {
        if (await ctx.huaweiService.refreshCountMsg()) {
            let messages = await ctx.huaweiService.getNewMessages();
            if (ctx.onNewMessages) {
                ctx.onNewMessages(messages);
            }
        }
    };

    ctx.init = (_logWriteService, _huaweiService, onNewMessages) => {
        ctx.logWriteService = _logWriteService;
        ctx.huaweiService   = _huaweiService;
        ctx.onNewMessages   = onNewMessages;
        setTimeout(ctx.reloadTime, 5000);

        ctx.logWriteService.write(`Initialization: Listener Service!`);
    };

    return ctx;
}