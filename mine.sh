#!/bin/bash

function generateBlocks() {
  num_blocks=${1:-1}

  receive_address=$(ord -r wallet receive | jq -r '.address')

  if [ -z "$receive_address" ]; then
    echo "Error fetching receive address"
    exit 1
  fi

  cmd="bitcoin-cli -regtest generatetoaddress $num_blocks $receive_address"

  result=$(eval $cmd)

  if [ $? -ne 0 ]; then
    echo "Error generating blocks"
    exit 1
  fi

  echo "Result: $result"
}

num=${1:-1}

generateBlocks $num
