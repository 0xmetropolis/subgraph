cp ./config/rinkeby.json ./config/rinkeby.json.tmp
CONTROLLER_ADDRESS=$(jq -r .address node_modules/@orcaprotocol/contracts/deployments/rinkeby/Controller.json)
CONTROLLER_BLOCK=$(jq -r .receipt.blockNumber node_modules/@orcaprotocol/contracts/deployments/rinkeby/Controller.json)
MEMBER_TOKEN_ADDRESS=$(jq -r .address node_modules/@orcaprotocol/contracts/deployments/rinkeby/MemberToken.json)
MEMBER_TOKEN_BLOCK=$(jq -r .receipt.blockNumber node_modules/@orcaprotocol/contracts/deployments/rinkeby/MemberToken.json)
jq -r \
    --arg CONTROLLER_ADDRESS "$CONTROLLER_ADDRESS" \
    --arg CONTROLLER_BLOCK "$CONTROLLER_BLOCK" \
    --arg MEMBER_TOKEN_ADDRESS "$MEMBER_TOKEN_ADDRESS" \
    --arg MEMBER_TOKEN_BLOCK "$MEMBER_TOKEN_BLOCK" \
    '.controller.address = $CONTROLLER_ADDRESS
    | .controller.startBlock = $CONTROLLER_BLOCK
    | .memberToken.address =$MEMBER_TOKEN_ADDRESS
    | .memberToken.startBlock =$MEMBER_TOKEN_BLOCK' \
    ./config/rinkeby.json.tmp > ./config/rinkeby.json
rm ./config/rinkeby.json.tmp
