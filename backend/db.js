const mongoose = require('mongoose');
const mdb = mongoose.connection;
const dbhost = 'mongodb://username:password@localhost:27017/decommerce';
const dbupdate = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(dbhost, dbupdate);
mdb.on('error', (err) => console.log('Error, MongoDB not connected!!!'));
mdb.on('connected', () => console.log('MongoDB connected...'));
mdb.on('disconnected', () => console.log('MongoDB is disconnected!!!'));
mdb.on('open', () => console.log('Connection made to MongoDB...'));

const paymentSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    paid: Boolean
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {
    Payment
};