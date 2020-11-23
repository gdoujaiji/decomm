import {ethers, Contract} from 'ethers';
import PaymentProcessor from './contracts/PaymentProcessor.json';
import Dai from './contracts/Dai.json';

// define a function that create the connection to ethereum
const getBlockchain = () => 
    // promise is an object to deal with asyncronous code
    new Promise((resolve, reject) => {
        //when promise is finished, resolve method is called everything will loaded in the browser
        window.addEventListener('load', async () => {
            // if MetaMask is present it will inject object ethereum inside windows
            if(window.ethereum){
                await window.ethereum.enable();
                // after user allow access to MetaMask
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                // get the sign object from the provider
                const signer = provider.getSigner();
                // instantiate an object that communicate with PaymentProcessor
                const paymentProcessor = new Contract(
                    PaymentProcessor.networks[window.ethereum.networkVersion].address,
                    PaymentProcessor.abi,
                    signer
                );

                const dai = new Contract(
                    Dai.networks[window.ethereum.networkVersion].address,
                    Dai.abi,
                    signer
                );
                resolve({provider, paymentProcessor, dai});
            }
            // if MetaMask is not installed, return empty
            resolve({provider: undefined, paymentProcessor: undefined, dai: undefined});
        });
    });

    export default getBlockchain;