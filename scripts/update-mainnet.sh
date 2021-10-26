#!/usr/bin/env bash

set -e

cp ./config/mainnet.json ./config/mainnet.json.tmp

CONTROLLER_ADDRESS=$(jq -r .address node_modules/@orcaprotocol/contracts/deployments/mainnet/Controller.json)
CONTROLLER_BLOCK=$(jq -r .receipt.blockNumber node_modules/@orcaprotocol/contracts/deployments/mainnet/Controller.json)
MEMBER_TOKEN_ADDRESS=$(jq -r .address node_modules/@orcaprotocol/contracts/deployments/mainnet/MemberToken.json)
MEMBER_TOKEN_BLOCK=$(jq -r .receipt.blockNumber node_modules/@orcaprotocol/contracts/deployments/mainnet/MemberToken.json)

jq -r \
    --arg CONTROLLER_ADDRESS "$CONTROLLER_ADDRESS" \
    --arg CONTROLLER_BLOCK "$CONTROLLER_BLOCK" \
    --arg MEMBER_TOKEN_ADDRESS "$MEMBER_TOKEN_ADDRESS" \
    --arg MEMBER_TOKEN_BLOCK "$MEMBER_TOKEN_BLOCK" \
    '.controller.address = $CONTROLLER_ADDRESS
    | .controller.startBlock = $CONTROLLER_BLOCK
    | .memberToken.address =$MEMBER_TOKEN_ADDRESS
    | .memberToken.startBlock =$MEMBER_TOKEN_BLOCK' \
    ./config/mainnet.json.tmp > ./config/mainnet.json

rm ./config/mainnet.json.tmp
