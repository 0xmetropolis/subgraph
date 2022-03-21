#!/usr/bin/env bash

set -e

cp ./config/mainnet.json ./config/mainnet.json.tmp

CONTROLLER_ADDRESS=$(jq -r .address node_modules/@orcaprotocol/contracts/deployments/mainnet/Controller.json)
CONTROLLER_BLOCK=$(jq -r .receipt.blockNumber node_modules/@orcaprotocol/contracts/deployments/mainnet/Controller.json)
CONTROLLERV1_ADDRESS=$(jq -r .address node_modules/@orcaprotocol/contracts/deployments/mainnet/ControllerV1.json)
CONTROLLERV1_BLOCK=$(jq -r .receipt.blockNumber node_modules/@orcaprotocol/contracts/deployments/mainnet/ControllerV1.json)
CONTROLLERV1_1_ADDRESS=$(jq -r .address node_modules/@orcaprotocol/contracts/deployments/mainnet/ControllerV1.1.json)
CONTROLLERV1_1_BLOCK=$(jq -r .receipt.blockNumber node_modules/@orcaprotocol/contracts/deployments/mainnet/ControllerV1.1.json)
MEMBER_TOKEN_ADDRESS=$(jq -r .address node_modules/@orcaprotocol/contracts/deployments/mainnet/MemberToken.json)
MEMBER_TOKEN_BLOCK=$(jq -r .receipt.blockNumber node_modules/@orcaprotocol/contracts/deployments/mainnet/MemberToken.json)

jq -r \
    --arg CONTROLLER_ADDRESS "$CONTROLLER_ADDRESS" \
    --arg CONTROLLER_BLOCK "$CONTROLLER_BLOCK" \
    --arg CONTROLLERV1_ADDRESS "$CONTROLLERV1_ADDRESS" \
    --arg CONTROLLERV1_BLOCK "$CONTROLLERV1_BLOCK" \
    --arg CONTROLLERV1_1_ADDRESS "$CONTROLLERV1_1_ADDRESS" \
    --arg CONTROLLERV1_1_BLOCK "$CONTROLLERV1_1_BLOCK" \
    --arg MEMBER_TOKEN_ADDRESS "$MEMBER_TOKEN_ADDRESS" \
    --arg MEMBER_TOKEN_BLOCK "$MEMBER_TOKEN_BLOCK" \
    '.controller.address = $CONTROLLER_ADDRESS
    | .controller.startBlock = $CONTROLLER_BLOCK
    | .controllerv1.address = $CONTROLLERV1_ADDRESS
    | .controllerv1.startBlock = $CONTROLLERV1_BLOCK
    | .controllerv1_1.address = $CONTROLLERV1_1_ADDRESS
    | .controllerv1_1.startBlock = $CONTROLLERV1_1_BLOCK
    | .memberToken.address =$MEMBER_TOKEN_ADDRESS
    | .memberToken.startBlock =$MEMBER_TOKEN_BLOCK' \
    ./config/mainnet.json.tmp > ./config/mainnet.json

rm ./config/mainnet.json.tmp
