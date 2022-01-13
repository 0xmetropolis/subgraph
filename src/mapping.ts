import {
  TransferSingle,
} from "../generated/MemberToken/MemberToken"
import { User, Pod, PodUser } from "../generated/schema";
import { store } from "@graphprotocol/graph-ts";
import { addressZero } from "../test/fixtures";

// These next two lines need to be commented out if you're deploying the subgraph
// and uncommented if you're testing.
// import { log } from "matchstick-as/assembly/log";
// export { runTests } from "../test/integration.spec";

export function handleTransferSingle(event: TransferSingle): void {
  let to = event.params.to.toHex();
  let from = event.params.from.toHex();
  let id = event.params.id.toString();

  let pod = Pod.load(id);
  if (pod == null) {
    pod = new Pod(id);
    pod.save();
  }

  // Create UserPod
  if (to != addressZero) {
    let podUser = new PodUser(to + '-' + id);
    podUser.user = to;
    podUser.pod = id;
    podUser.save();
  }

  // Remove old one
  if (from != addressZero) {
    store.remove('PodUser', from + '-' + id);
  }

  // Create new address, unless it's zero address
  if (to != addressZero) {
    let toUser = new User(to);
    toUser.save();
  }
}
