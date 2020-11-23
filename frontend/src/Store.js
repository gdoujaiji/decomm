import React from 'react';
import {ethers} from 'ethers';
import axios from 'axios';

const API_URL = 'http://localhost:4000';
const ITEMS = [
    {
        id: 1,
        price: ethers.utils.parseEther('100')
    },
    {
        id: 2,
        price: ethers.utils.parseEther('200')
    },
];

function Store({paymentProcessor, dai}) {
    const buy = async item => {
        // get the paymentId from the backend
        const response1 = await axios.get(`${API_URL}/api/getPaymentId/${item.id}`);
        // to approve the paymentProcessor to spend dai
        const tx1 = await dai.approve(paymentProcessor.address, item.price);
        // wait untill transaction is mined
        await tx1.wait();

        // send the signature transaction to do the payment transaction
        const tx2 = await paymentProcessor.pay(item.price, response1.data.paymentId);
        await tx2.wait();

        await new Promise(resolve => setTimeout(resolve, 5000));
        // finaly get the download URL
        const response2 = await axios.get(`${API_URL}/api/getItemUrl/${response1.data.paymentId}`);
        // display the download URL
        console.log(response2);
    };
    return (
        <ul className='list-group'>
            <li className='list-group-item'>
                Buy item1 - <span className='front-weight-bold'>100 DAI</span>
                <button type='button' className='btn btn-primary float-right' onClick={() => ByteLengthQueuingStrategy(ITEMS[0])}>Buy</button>
            </li>
            <li className='list-group-item'>
                Buy item2 - <span className='front-weight-bold'>200 DAI</span>
                <button type='button' className='btn btn-primary float-right' onClick={() => ByteLengthQueuingStrategy(ITEMS[1])}>Buy</button>
            </li>
        </ul>
    );
}

export default Store;