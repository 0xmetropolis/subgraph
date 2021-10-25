# Subgraph

Subgraph for Orca Protocol contracts

## Getting Started

Run `npm install`. Run `npm install -g @graphprotocol/graph-cli` if you don't have that.

When you first startup, you'll need to run `npm run codegen` and `npm run build` to generate all necessary files.

When you make changes, you can run `npm run build` to check if the subgraph builds properly.

## Deploy

This subgraph is configured to deploy to both mainnet and rinkeby.

Steps:

1. Update `@orcaprotocol/contracts` via npm.
1. Run `npm run deploy:rinkeby`, which will automatically update the subgraph.yaml with the new info from the package, and then deploy the subgraph.

If you only want to update the config file, you can run `npm run prepare:rinkeby`.

## Testing

Run this command: https://github.com/LimeChain/matchstick#macos-

After you do so, you can run `npm run test`, which will build and run tests.
