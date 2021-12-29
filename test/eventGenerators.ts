import { ethereum, Address } from '@graphprotocol/graph-ts';
import { clearStore, test, assert, newMockEvent } from "matchstick-as/assembly/index";
import { TransferSingle, MigrateMemberController } from '../generated/MemberToken/MemberToken';
import { 
  CreatePod,
  UpdatePodAdmin,
} from '../generated/Controller/Controller';

// Generates events for test purposes

function AddressParam(address: string): ethereum.EventParam {
  let param = new ethereum.EventParam();
  param.value = ethereum.Value.fromAddress(Address.fromString(address));
  return param;
}

function I32Param(input: i32): ethereum.EventParam {
  let param = new ethereum.EventParam();
  param.value = ethereum.Value.fromI32(input);
  return param;
}

function StringParam(input: string): ethereum.EventParam {
  let param = new ethereum.EventParam();
  param.value = ethereum.Value.fromString(input);
  return param;
}

export function generateCreatePod(id: i32, safeAddress: string, admin: string, ensName: string): CreatePod {
  let CreatePodEvent = new CreatePod();

  CreatePodEvent.parameters.push(I32Param(id));
  CreatePodEvent.parameters.push(AddressParam(safeAddress));
  CreatePodEvent.parameters.push(AddressParam(admin));
  CreatePodEvent.parameters.push(StringParam(ensName));

  return newMockEvent(CreatePodEvent) as CreatePod;
}

export function generateTransferSingle(operator: string, from: string, to: string, id: i32, value: i32): TransferSingle {
  let TransferSingleEvent = new TransferSingle();

  TransferSingleEvent.parameters.push(AddressParam(operator));
  TransferSingleEvent.parameters.push(AddressParam(from));
  TransferSingleEvent.parameters.push(AddressParam(to));
  TransferSingleEvent.parameters.push(I32Param(id));
  TransferSingleEvent.parameters.push(I32Param(value));

  return newMockEvent(TransferSingleEvent) as TransferSingle;
}

export function generateMigrateMemberController(podId: i32, newController: string): MigrateMemberController {
  let MigrateMemberControllerEvent = new MigrateMemberController();

  MigrateMemberControllerEvent.parameters.push(I32Param(podId));
  MigrateMemberControllerEvent.parameters.push(AddressParam(newController));

  return newMockEvent(MigrateMemberControllerEvent) as MigrateMemberController;
}

export function generateUpdatePodAdmin(podId: i32, admin: string): UpdatePodAdmin {
  let UpdatePodAdminEvent = new UpdatePodAdmin();

  UpdatePodAdminEvent.parameters.push(I32Param(podId));
  UpdatePodAdminEvent.parameters.push(AddressParam(admin));

  return newMockEvent(UpdatePodAdminEvent) as UpdatePodAdmin;
}