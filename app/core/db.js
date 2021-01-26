const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

class Mongo {
	connect() {
		mongoose.connect(global.config.database, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		mongoose.connection.on('connected', () => {
			console.log('数据库连接成功');
		});

		mongoose.connection.on('error', () => {
			console.log(error);
		});
	}
}

const mongo = new Mongo();
module.exports = mongo;