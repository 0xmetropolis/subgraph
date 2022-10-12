const { readdir, readFile, writeFile } = require("fs/promises");
const yaml = require("js-yaml");
const util = require("util");

const deploymentRoot = "./node_modules/@orcaprotocol/contracts/deployments";
const network = process.argv[2];
const deploymentFolder = `${deploymentRoot}/${network}`;

async function main() {
  let deployments;
  try {
    deployments = await readdir(deploymentFolder);
  } catch (err) {
    console.log(err);
  }

  const controllers = deployments.filter((contract) => {
    return contract.includes("Controller") && !contract.includes("Registry");
  });

  const template = yaml.load(await readFile("./subgraph.template.yaml"));

  const output = {
    network,
  };

  const memberToken = JSON.parse(
    await readFile(`${deploymentFolder}/MemberToken.json`)
  );

  // Handle MemberToken separately.
  template.dataSources[0].network = network;
  template.dataSources[0].source.address = memberToken.address;
  template.dataSources[0].source.startBlock = memberToken.receipt.blockNumber;

  await Promise.all(
    controllers.map(async (controller) => {
      // Read the JSON
      const controllerJson = JSON.parse(
        await readFile(`${deploymentFolder}/${controller}`)
      );
      // Sometimes it comes back in hex, so parse it into a number.
      const startBlock =
        typeof controllerJson.receipt.blockNumber === "string"
          ? parseInt(controllerJson.receipt.blockNumber, 16)
          : controllerJson.receipt.blockNumber;

      // Controller name, but with an underscore instead of a .
      const underscoreName = controller.replace(".json", "").replace(".", "_");
      // This will be like "V1_1" or just an empty string.
      const version = underscoreName.split("V")[1]
        ? `V${underscoreName.split("V")[1]}`
        : "";

      const controllerTemplate = {
        kind: "ethereum/contract",
        name: underscoreName,
        network,
        source: {
          address: controllerJson.address,
          abi: underscoreName,
          startBlock,
        },
        mapping: {
          kind: "ethereum/events",
          apiVersion: "0.0.5",
          language: "wasm/assemblyscript",
          entities: ["UpdatePodAdmin"],
          abis: [
            { name: underscoreName, file: `${deploymentFolder}/${controller}` },
          ],
          eventHandlers: [
            {
              event: "UpdatePodAdmin(uint256,address)",
              handler: `handleUpdatePodAdmin${version}`,
            },
          ],
          file: "./src/mapping.ts",
        },
      };
      // TODO: Need actual version checks.
      console.log("version", version);
      if (version === "V1_3" || version === "V1_4")
        controllerTemplate.mapping.eventHandlers.push({
          event: "DeregisterPod(uint256)",
          handler: `handleDeregisterPod${version}`,
        });
      template.dataSources.push(controllerTemplate);
    })
  );
  await writeFile("./subgraph.yaml", yaml.dump(template, { sortKeys: true }));
}

main();
