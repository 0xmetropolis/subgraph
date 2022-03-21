# Subgraph

Subgraph for Orca Protocol contracts

## Getting Started

Run `npm install`. Run `npm install -g @graphprotocol/graph-cli` if you don't have that.

When you first startup, or when we update the contracts, you'll need to run `npm run codegen` and `npm run build` to generate all necessary files.

When you make changes, you can run `npm run build` to check if the subgraph builds properly, and `npm run test` to run the tests.

## Deploying Subgraph

This subgraph is configured to deploy to both mainnet and rinkeby.

### Adding New Contracts

If new contracts have been added, for example, a new Controller version, then you'll need to update `./scripts/`, and add a new entry to the `subgraph.template.yaml`

If this is unnecessary, you can skip to the deployment process below.

#### Updating ./scripts

Using ControllerV1.1 as an example, you would have to add the following lines to the script:

```sh
CONTROLLERV1_1_ADDRESS=$(jq -r .address node_modules/@orcaprotocol/contracts/deployments/rinkeby/ControllerV1.1.json)
CONTROLLERV1_1_BLOCK=$(jq -r .receipt.blockNumber node_modules/@orcaprotocol/contracts/deployments/rinkeby/ControllerV1.1.json)

# ...

    --arg CONTROLLERV1_1_ADDRESS "$CONTROLLERV1_1_ADDRESS" \
    --arg CONTROLLERV1_1_BLOCK "$CONTROLLERV1_1_BLOCK" \

# ...

    | .controllerv1_1.address = $CONTROLLERV1_1_ADDRESS
    | .controllerv1_1.startBlock = $CONTROLLERV1_1_BLOCK
```

This will feed into the `subgraph.template.yaml`, where you need to add a new entry:

```yaml
- kind: ethereum/contract
  name: ControllerV1
  network: { { network } }
  source:
    address: "{{controllerv1.address}}"
    abi: ControllerV1
    startBlock: { { controllerv1.startBlock } }
  mapping:
    kind: ethereum/events
    apiVersion: 0.0.5
    language: wasm/assemblyscript
    entities:
      - UpdatePodAdmin
    abis:
      - name: ControllerV1
        file: ./node_modules/@orcaprotocol/contracts/deployments/rinkeby/ControllerV1.json
    eventHandlers:
      - event: UpdatePodAdmin(uint256,address)
        handler: handleUpdatePodAdminV1
    file: ./src/mapping.ts
```

You will also need to add a new event Handler, which you can see in `mapping.ts`.

### Deployment

#### Rinkeby

1. Run `npm run prepare:rinkeby` to populate the `subgraph.yaml` with the values from the shell script.
2. Verify that the information in `subgraph.yaml` looks correct, i.e., the network, block numbers, ABIs, etc.
3. Run `npm run deploy:rinkeby` and provide a new version number. You can see the current version on our [subgraph page](https://thegraph.com/studio/subgraph/orca-1/).
4. Monitor the subgraph page to see if the syncing completes correctly.
5. If syncing was successful, then update the web app to use the new query URL. The query URL should be: `https://api.studio.thegraph.com/query/3720/orca-1/{{new version number}}`

#### Mainnet

1. Run `npm run prepare:mainnet` to populate the `subgraph.yaml`.
2. Verify that the information in `subgraph.yaml` looks correct, i.e., the network, block numbers, ABIs, etc.
3. Run `npm run deploy:mainnet` and provide a new version number. You can see the current version on our [subgraph page](https://thegraph.com/studio/subgraph/orca-protocol/).
4. After deployment, hit the `Publish` button on the subgraph page. This will require a transaction and some GRT.
5. Monitor the [explorer page](https://thegraph.com/explorer/subgraph?id=3d9m1BPre8pEknjPNMyMbNYYgb1vb672D9SSRm9n5a6s&view=Indexers) to see when we get picked up by indexers. This should typically takes less than 30 minutes.

## Testing

Run this command: https://github.com/LimeChain/matchstick#macos-

After you do so, you can run `npm run test`, which will build and run tests.
