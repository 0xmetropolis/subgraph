import {
  // ApprovalForAll,
  // ControllerRegister,
  // ControllerRemove,
  // OwnershipTransferred,
  // URI,
  TransferBatch,
  TransferSingle,
} from "../generated/MemberToken/MemberToken"
import { 
  CreateSafe,
} from '../generated/SafeTeller/SafeTeller';
import { User, Pod } from "../generated/schema"

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
  const to = event.params.to;
  const from = event.params.from;
  const id = event.params.id;
  let toUser = User.load(to.toHex());
  if (toUser === null) {
    toUser = new User(to.toHex());
    toUser.pods = [];
  }
  // Add new ID to array of pods
  toUser.pods = toUser.pods.concat([id.toString()]);
  toUser.save();

  const fromUser = User.load(from.toHex());
  // The fromUser should never be null, because the User is created
  // when they first receive a token.
  // This check is just assurance.
  if (fromUser !== null) {
    // Remove the pod from the user's "pods" array
    fromUser.pods = fromUser.pods.splice(fromUser.pods.indexOf(id.toString()), 1);
    fromUser.save();
  }
}

export function handleCreateSafe(event: CreateSafe): void {
  const podId = event.params.podId;
  const safeAddress = event.params.safeAddress;
  const pod = new Pod(podId.toString());
  pod.safe = safeAddress;
  pod.save()
}

// export function handleApprovalForAll(event: ApprovalForAll): void {}

// export function handleControllerRegister(event: ControllerRegister): void {}

// export function handleControllerRemove(event: ControllerRemove): void {}

// export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

// export function handleURI(event: URI): void {}
