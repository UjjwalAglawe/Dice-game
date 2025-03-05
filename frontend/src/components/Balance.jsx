// Balance.jsx
import React, { useState } from 'react';
import Web3 from 'web3';

function Balance() {
  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState(null);

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        getBalance(accounts[0], web3);
      } catch (error) {
        console.error('Error connecting to Metamask:', error);
      }
    } else {
      console.log('Metamask not detected');
    }
  };

  const getBalance = async (account, web3) => {
    const balanceWei = await web3.eth.getBalance(account);
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
    setBalance(balanceEth);
  };

  const handleConnect = async () => {
    await connectToMetamask();
  };

  return (
    <div className="flex items-center bg-[#24292F] rounded-lg overflow-hidden w-fit top-4">
      {account ? (
        <>
          <div className="flex items-center px-4 py-3 border-r border-[#3A3F44]">
            <span className="text-lg font-bold mr-2 text-white">
            {Number(balance).toFixed(2)} ETH
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 2 L2 14 L16 26 L30 14 Z" />
              <path d="M16 14 L2 26" />
              <path d="M16 14 L30 26" />
            </svg>
          </div>
          <div className="bg-[#1E90FF] text-white px-6 py-3 font-bold cursor-pointer">
            Wallet
          </div>
        </>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-[#1E90FF] text-white px-6 py-3 font-bold rounded-lg cursor-pointer"
        >
          Connect
        </button>
      )}
    </div>
  );
}

export default Balance;