# Subgraph

Subgraph for Orca Protocol contracts

## Getting Started

Run `npm install`. Run `npm install -g @graphprotocol/graph-cli` if you don't have that.

When you first startup, you'll need to run `npm run codegen` and `npm run build` to generate all necessary files.

When you make changes, you can run `npm run build` to check if the subgraph builds properly.

## Deploy

Run `graph deploy --studio orca-1` to deploy that compiled subgraph to our hosted service

Check https://thegraph.com/studio/subgraph/orca-1/ for its status.

## Testing

Run this command: https://github.com/LimeChain/matchstick#macos-

After you do so, you can run `npm run test`, which will build and run tests.
