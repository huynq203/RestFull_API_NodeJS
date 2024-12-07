const mongoose = require('mongoose');
const config = require('config');
connect().catch(err => console.log(err));

async function connect() {
    await mongoose.connect(config.get('db.DB_URI'));
    console.log("Kết nối database duanhip06 thành công");
}

module.exports = connect();