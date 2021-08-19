import {
  TransferBatch,
  TransferSingle,
} from "../generated/MemberToken/MemberToken"
import { 
  CreateSafe,
} from '../generated/SafeTeller/SafeTeller';
import { User, Pod, PodUser } from "../generated/schema";
import { store } from "@graphprotocol/graph-ts";
import { addressZero } from "../test/fixtures";

// These next two lines need to be commented out if you're deploying the subgraph
// import { log } from "matchstick-as/assembly/log";
// export { runTests } from "../test/integration.spec";

// export function handleTransferBatch(event: TransferBatch): void {
//   const to = event.params.to;
//   const from = event.params.from;
//   const ids = event.params.ids;

//   let toUser = User.load(to.toHex());
//   if (toUser === null) {
//     toUser = new User(to.toHex());
//   }

//   // GraphQL expects ID to be a string
//   const stringIds = ids.map(id => id.toString());

//   toUser.pods = toUser.pods.concat(stringIds);
//   toUser.save();

//   // The fromUser should never be null, because the User is created
//   // when they first receive a token.
//   // const fromUser = User.load(from.toHex());
//   // // This check is just assurance.
//   // if (fromUser !== null) {
//   //   // Remove each ID from the fromUser's pod array
//   //   stringIds.forEach(id => {
//   //     fromUser.pods = fromUser.pods.splice(fromUser.pods.indexOf(id.toString()), 1);
//   //   })
//   //   fromUser.save();
//   // }
// }

export function handleTransferSingle(event: TransferSingle): void {
  let to = event.params.to.toHex();
  let from = event.params.from.toHex();
  let id = event.params.id.toString();

  // Create UserPod
  let podUser = new PodUser(to + '-' + id);
  podUser.user = to;
  podUser.pod = id;
  podUser.save();
  
  // Remove old one
  if (from != addressZero) {
    store.remove('PodUser', from + '-' + id);
  }

  let toUser = User.load(to);
  if (toUser === null) {
    toUser = new User(to);
  }
  toUser.save();
}

export function handleCreateSafe(event: CreateSafe): void {
  let podId = event.params.podId.toString();
  let safeAddress = event.params.safeAddress;
  let pod = new Pod(podId);
  pod.safe = safeAddress;
  pod.save()
}
