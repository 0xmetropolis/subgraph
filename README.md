# Subgraph

Subgraph for Orca Protocol contracts

## Getting Started

Run `npm install`. Run `npm install -g @graphprotocol/graph-cli` if you don't have that.

When you first startup, or when we update the contracts, you'll need to run `npm run codegen` and `npm run build` to generate all necessary files.

When you make changes, you can run `npm run build` to check if the subgraph builds properly, and `npm run test` to run the tests.

## Deploying Subgraph

This subgraph is configured to deploy to both mainnet and rinkeby.

### Adding New Contracts

Install the updated Contracts package

Run `npm run codegen`

The `npm run prepare` scripts will handle new Controller versions, the only thing you need to do is update `src/mapping.ts` with a new `handlePodAdmin` function and `deregisterPod`:

```js
export function handleUpdatePodAdmin(event: UpdatePodAdmin): void {
  let id = event.params.podId.toString();
  let newAdminAddress = event.params.admin.toHex();

  updatePodAdminLogic(id, newAdminAddress);
}

export function handleDeregisterPodV1_4(event: DeregisterPodV1_4): void {
  let id = event.params.podId.toString();
  deregisterPodLogic(id);
}
```

DEV NOTE: Ugh, for now we have to manually modify the version check in the eventGenerator function, i.e.,

```js
// TODO: Need actual version checks.
if (version === "1.3")
  controllerTemplate.eventHandlers.push({
    event: "DeregisterPod(uint256)",
    handler: `handleDeregisterPod`,
  });
```

You will need to manually add any new contracts that are not Controller though.

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
