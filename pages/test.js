import React from 'react';
import { TransactionFactory } from '@ethereumjs/tx';
import { fromRpcSig, keccakFromHexString } from 'ethereumjs-util';
import ethCommon from '@ethereumjs/common';
import Web3 from '@node-real/web3';

export default () => {
  const handleSign = async () => {
    const directRouteEndPoint = 'https://api.nodereal.io/direct-route';
    const web3 = new Web3(directRouteEndPoint);

    const price = await web3.eth.getBundlePrice();
    const gasPrice = web3.utils.toHex(price);

    // mock data
    const txParams = {
      from: '0xFf21ddc5b114a5E4F1ee813180276dDdE7160C73',
      to: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
      value: '0x0',
      data: '0x38ed1739000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000011bd3cf890ef6f00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000ff21ddc5b114a5e4f1ee813180276ddde7160c730000000000000000000000000000000000000000000000000000000061769bf20000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d560000000000000000000000000e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      gasLimit: '0x2e1f3',
      gasPrice,
      nonce: 184,
    };
    console.log(txParams);

    const common = ethCommon.forCustomChain(
      'mainnet',
      'https://bsc-dataseed.binance.org',
      'chainstart',
    );
    const tx = TransactionFactory.fromTxData(txParams, { common });

    // *********
    const unsignedTx = tx.getMessageToSign();

    const signature = await window.ethereum.request({
      method: 'eth_sign',
      params: [window.ethereum.selectedAddress, web3.utils.toHex(unsignedTx)],
    });
    const signatureParts = fromRpcSig(signature);

    const txWithSignature = tx._processSignature(
      signatureParts.v,
      Buffer.from(signatureParts.r),
      Buffer.from(signatureParts.s),
    );

    const rawTransaction = `0x${txWithSignature.serialize().toString('hex')}`;
    const transactionHash = web3.utils.keccak256(rawTransaction);

    const myDate = new Date();
    const maxTime = Math.floor(myDate.getTime() / 1000) + 80;
    const minTime = Math.floor(myDate.getTime() / 1000) + 20;

    const bundleArgs = {
      txs: [rawTransaction],
      minTimestamp: minTime,
      maxTimestamp: maxTime,
      revertingTxHashes: [transactionHash],
    };
    console.log(bundleArgs);

    const bundleHash = await web3.eth.sendBundle(bundleArgs);
    console.log('bundleHash: ', bundleHash);
    // send to bsc-testnet
    // const result = await window.ethereum.request({
    //   method: 'eth_sendRawTransaction',
    //   params: [signedTx],
    // });
    // console.log('result: ', result);
  };

  return <button onClick={handleSign}>Test</button>;
};
