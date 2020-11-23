import React, {useState, useEffect} from 'react';
import Store from './Store.js';
import getBlockchain from './ethereum.js';

function App() {
  // define the state
  const [paymentProcessor, setPaymentProcessor] = useState(undefined);
  const [dai, setDai] = useState(undefined);

  // use useEffect function to trgger any asyncronous functions
  useEffect(() => {
    const init = async () => {
      const {paymentProcessor, dai} = await getBlockchain();
      setPaymentProcessor(paymentProcessor);
      setDai(dai);
    }
    init();
  }, []);

  // if MetaMask is not installed
  if(typeof window.ethereum === 'undefined'){
    return (
      <div className='container'>
        <div className='col-sm-12'>
          <h1>DeEcommerce App</h1>
          <p>You need to install the latest version of Metamask...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='col-sm-12'>
        <h1>DeEcommerce App</h1>
        <Store paymentProcessor={paymentProcessor} dai={dai} />
      </div>
    </div>
  );
}

export default App;
