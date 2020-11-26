const Dai = artifacts.require('Dai.sol');
const PaymentProcessor = artifacts.require('PaymentProcessor.sol');

module.exports = async function (deployer, network, addresses) {
    const [admin, payer, _] = addresses;
    if(network === 'develop') {
        await deployer.deploy(Dai); // send the transection
        const dai = await Dai.deployed(); // wait for the transaction to be mined
        await dai.faucet(payer, web3.utils.toWei('10000')); // create some token for the payer
        // 1 DAI token = 1 * 10 * 18 dai Wei
        // 1 Ether = 1 * 10 * 18 ether Wei

        // deploy the payment processor
        await deployer.deploy(PaymentProcessor, admin, dai.address);
    } else {
        const ADMIN_ADDRESS = '';
        const DAI_ADDRESS = '';
        await deployer.deploy(PaymentProcessor, ADMIN_ADDRESS, DAI_ADDRESS);
    }
};
