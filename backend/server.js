const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentProcessor = require('../frontend/src/contracts/PaymentProcessor.json');
const {Payment} = require('./db.js');

const app = new Koa();
const router = new Router();

// for this demo, items to be purchased are hard coded; later will be called from the database
const items = {
    '1':{id: 1, url: 'http://UrlToDownloadItem1'},
    '2':{id: 2, url: 'http://UrlToDownloadItem2'},
}

router.get('/api/getPaymentId/:itemId', async ctx => {
    // generate a payment ID
    const paymentId = (Math.random() * 10000).toFixed(0);
    // craete a payment entry in mongodb
    await Payment.create({
        id: paymentId,
        itemId: ctx.params.itemId,
        paid: false
    });
    ctx.body = {
        //paymentId: paymentId
        paymentId
    };
});

// create another route for the item that cam be perchased
router.get('/api/getItemUrl/:paymentId', async ctx =>{
    const payment = await Payment.findOne({id: ctx.params.paymentId});
    if(payment && payment.paid === true) {
        ctx.body = {
            url: items[payment.itemId].url
        };
    } else {
        // if payment not done show empty URL
        ctx.body = {
            url: ''
        };
    }
});

app.use(cors()).use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
    console.log('Server running on port 4000');
});

const listenToEvents = () => {
    // connect to ethereum blockchain
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:9545'); // to be changed to main net when deployed
    // define a network ID
    const networkId = '5777'; // to be changed according to the deployed network
    // define a contract object
    const paymentProcessor = new ethers.Contract(
        PaymentProcessor.networks[networkId],
        PaymentProcessor.abi, // Json description of the smart contract
        provider // ether provider
    );

    paymentProcessor.on('PaymentDone', async (payer, amount, paymentId, date) => {
        console.log(`
            from ${payer}
            amount ${amount}
            paymentId ${paymentId}
            date ${(new Date(date.toNumber() * 1000)).toLocalString()}
        `);
        // change payment status if found
        const payment = await Payment.findOne({id: paymentId});
        if(payment) {
            payment.paid = true;
            await payment.save();
        }
    });
};

// trigger the function listenToEvents
listenToEvents();