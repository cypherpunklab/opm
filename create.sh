#!/bin/bash

function executeCommand() {
  command=$1
  result=$(eval $command)
  echo $result
  return $?
}

walletName=$(executeCommand 'bitcoin-cli -regtest getwalletinfo | jq -r '.walletname'')

if [ "$walletName" == "ord" ]; then
  echo "Wallet named ord exists, exiting."
  exit 1
fi

executeCommand 'ord -r wallet create'
receiveAddress=$(executeCommand 'ord -r wallet receive')
if [[ $receiveAddress == *"RpcError code -4"* ]]; then
  echo "Error: Wallet file verification failed. Wallet already created."
  exit 1
fi

receiveAddress=$(echo $receiveAddress | jq -r '.address')

executeCommand "bitcoin-cli -regtest generatetoaddress 120 $receiveAddress"

balance=$(executeCommand 'ord -r wallet balance')
balance=$(echo $balance | jq -r '.balance')
echo 'Initialized ord wallet'
