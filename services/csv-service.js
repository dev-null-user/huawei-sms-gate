const pathsave 		= "./report";
const fs 			= require('fs');
const dateFormat	= require('date-format');

module.exports = () => {
    let ctx = {};
    let filename = '';

    ctx.appendRow = (phone, message) => {
        if (filename != '') {

			if (filename != dateFormat('yyyy-MM-dd', new Date())) {
				ctx.init();
			}

            text = `${phone},${message},${dateFormat('yyyy-MM-dd hh:mm:ss', new Date())}\n`;
						
			fs.appendFile(`./${pathsave}/${filename}.csv`, text, (err) => {
			  if (err) {
				 console.log('Csv Service  appendRow - err: ', err);
			  };
			});
		}
    }

    ctx.readRowsByDate = (date, callResult) => {
        date = date ? date : dateFormat('dd-MM-yyyy', new Date());
        path = `./${pathsave}/${date}.csv`;

        if (!fs.existsSync(path)) {
            callResult(null);
            return;
        }

        fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
            if (!err) {
                callResult(data);
            } else {
                console.log(err);
                callResult(null);
            }
        });
    };

    ctx.init = () => {
		filename = dateFormat('dd-MM-yyyy', new Date());

        path = `./${pathsave}/${filename}.csv`;

        if (!fs.existsSync(path)) {
            fs.appendFile(path, `Телефон,Сообщение,Дата время\n`, (err) => {
                if (err) {
                    console.log('Csv Service  appendRow - err: ', err);
                };
            });
        }
	};

    return ctx;
}