import {
  TransferSingle,
} from "../generated/MemberToken/MemberToken"
import { 
  CreatePod,
  UpdatePodAdmin,
} from '../generated/Controller/Controller';
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

export function handleCreatePod(event: CreatePod): void {
  let podId = event.params.podId.toString();
  let safeAddress = event.params.safe;
  let admin = event.params.admin;
  let ensName = event.params.ensName;

  let pod = new Pod(podId);
  pod.safe = safeAddress;
  pod.admin = admin;
  pod.ensName = ensName;
  pod.save()
}

export function handleUpdatePodAdmin(event: UpdatePodAdmin): void {
  let podId = event.params.podId.toString();
  let admin = event.params.admin;
  // This should never return a null, because it assumes CreateSafe fires first.
  // Order is guaranteed according to some guy on The Graph discord.
  let pod = Pod.load(podId);
  pod.admin = admin;
  pod.save();
}