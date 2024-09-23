const pathsave 		= "./report";
const fs 			= require('fs');
const dateFormat	= require('date-format');

module.exports = () => {
    let ctx = {};
    let filename = '';

    ctx.appendRow = (phone, message, direction = 'out', datetime = null) => {
        if (filename != '') {

			if (filename != dateFormat('yyyy-MM-dd', new Date())) {
				ctx.init();
			}

            text = `${phone},${message},${datetime || dateFormat('yyyy-MM-dd hh:mm:ss', new Date())}\n`;
						
			fs.appendFile(`./${pathsave}/${direction}/${filename}.csv`, text, (err) => {
			  if (err) {
				 console.log('Csv Service  appendRow - err: ', err);
			  };
			});
		}
    }

    ctx.getPathOnFile = (date, direction, callResult) => {
        date = date ? date : dateFormat('dd-MM-yyyy', new Date());
        path = `./${pathsave}/${direction}/${date}.csv`;

        if (!fs.existsSync(path)) {
            callResult(null);
            return;
        }
        
        callResult(path)
    };

    ctx.resetCsv = (path) => {

        if (!fs.existsSync(path)) {
            return false;
        }

        fs.rmSync(path);

        fs.appendFile(path, `phone,message,datetime\n`, (err) => {
            if (err) {
                console.log('Csv Service  appendRow - err: ', err);
            };
        });

        return true;
    }

    ctx.readRowsByDate = (date, direction, callResult) => {
        date = date ? date : dateFormat('dd-MM-yyyy', new Date());
        path = `./${pathsave}/${direction}/${date}.csv`;

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

        path = `./${pathsave}/in/${filename}.csv`;

        if (!fs.existsSync(path)) {
            fs.appendFile(path, `phone,message,datetime\n`, (err) => {
                if (err) {
                    console.log('Csv Service  appendRow - err: ', err);
                };
            });
        }

        path = `./${pathsave}/out/${filename}.csv`;

        if (!fs.existsSync(path)) {
            fs.appendFile(path, `phone,message,datetime\n`, (err) => {
                if (err) {
                    console.log('Csv Service  appendRow - err: ', err);
                };
            });
        }
	};

    return ctx;
}