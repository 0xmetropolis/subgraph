import {
  TransferSingle,
} from "../generated/MemberToken/MemberToken"
import {
  UpdatePodAdmin as UpdatePodAdminV1_1,
} from "../generated/ControllerV1_1/ControllerV1_1"
import {
  UpdatePodAdmin as UpdatePodAdminV1,
} from "../generated/ControllerV1/ControllerV1"
import {
  UpdatePodAdmin,
} from "../generated/Controller/Controller"
import { User, Pod, PodUser } from "../generated/schema";
import { store } from "@graphprotocol/graph-ts";
import { addressZero } from "../tests/fixtures";

// These next two lines need to be commented out if you're deploying the subgraph
// and uncommented if you're testing.
import { log } from "matchstick-as/assembly/log";

export function handleTransferSingle(event: TransferSingle): void {
  let to = event.params.to.toHex();
  let from = event.params.from.toHex();
  let id = event.params.id.toString();

  let pod = Pod.load(id);
  if (pod == null) {
    pod = new Pod(id);
    pod.admin = addressZero;
    pod.save();
  }

  // Create UserPod, unless this is a burn
  if (to != addressZero) {
    let podUser = new PodUser(to + '-' + id);
    podUser.user = to;
    podUser.pod = id;
    podUser.save();

    // Create toUser, if one does not exist.
    let toUser = User.load(to);
    if (toUser == null) {
      // Otherwise instantiate new user.
      toUser = new User(to);
      toUser.adminPods = new Array<string>();
      toUser.save();
    }
  }

  // Remove UserPod, unless this is a mint.
  if (from != addressZero) {
    store.remove('PodUser', from + '-' + id);
  }
}

function updatePodAdminLogic(id: string, newAdminAddress: string): void {
  // Pod should exist since the tokens are minted first.
  let pod = Pod.load(id);
  if (pod == null) return; // Shouldn't happen, but required for type check.
  
  // If an pod.admin exists, i.e., not addressZero,
  // we need to remove the id from the old admin
  if (pod.admin != addressZero) {
    let oldAdmin = User.load(pod.admin.toString());
    if (!oldAdmin) return;
    // Filter the working ID from the old admin's list of ids.
    let newAdminPods = new Array<string>();
    for (let i = 0; i < oldAdmin.adminPods.length; i++) {
      if (oldAdmin.adminPods[i] != id) {
        newAdminPods.push(oldAdmin.adminPods[i]);
      }
    }
    oldAdmin.adminPods = newAdminPods;
    oldAdmin.save();
  }

  // Update pod.admin with the new admin
  pod.admin = newAdminAddress;
  pod.save();

  // Update the new admin's user array.
  let newAdmin = User.load(newAdminAddress);
  if (!newAdmin) return;
  let newAdminPods = newAdmin.adminPods;
  newAdminPods.push(id);
  newAdmin.adminPods = newAdminPods;
  newAdmin.save();
}

export function handleUpdatePodAdmin(event: UpdatePodAdmin): void {
  let id = event.params.podId.toString();
  let newAdminAddress = event.params.admin.toHex();

  updatePodAdminLogic(id, newAdminAddress);
}

export function handleUpdatePodAdminV1(event: UpdatePodAdminV1): void {
  let id = event.params.podId.toString();
  let newAdminAddress = event.params.admin.toHex();

  updatePodAdminLogic(id, newAdminAddress);
}

export function handleUpdatePodAdminV1_1(event: UpdatePodAdminV1_1): void {
  let id = event.params.podId.toString();
  let newAdminAddress = event.params.admin.toHex();

  updatePodAdminLogic(id, newAdminAddress);
}
