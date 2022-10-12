import { ethereum, Address } from '@graphprotocol/graph-ts';
import { newMockEvent } from "matchstick-as/assembly/index";
import { TransferSingle } from '../generated/MemberToken/MemberToken';
import { 
  UpdatePodAdmin,
} from '../generated/Controller/Controller';
import { 
  UpdatePodAdmin as UpdatePodAdminV1,
} from '../generated/ControllerV1/ControllerV1';
import { DeregisterPod } from '../generated/ControllerV1_3/ControllerV1_3';

// Generates events for test purposes

function AddressParam(label: string, address: string): ethereum.EventParam {
  let param = new ethereum.EventParam(label, ethereum.Value.fromAddress(Address.fromString(address)));
  return param;
}

function I32Param(label: string, input: i32): ethereum.EventParam {
  let param = new ethereum.EventParam(label, ethereum.Value.fromI32(input));
  return param;
}

function StringParam(label: string, input: string): ethereum.EventParam {
  let param = new ethereum.EventParam(label, ethereum.Value.fromString(input));
  return param;
}

export function generateTransferSingle(operator: string, from: string, to: string, id: i32, value: i32): TransferSingle {
  let mockEvent = newMockEvent();
  let TransferSingleEvent = new TransferSingle(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );

  TransferSingleEvent.parameters.push(AddressParam('operator', operator));
  TransferSingleEvent.parameters.push(AddressParam('from', from));
  TransferSingleEvent.parameters.push(AddressParam('to', to));
  TransferSingleEvent.parameters.push(I32Param('id', id));
  TransferSingleEvent.parameters.push(I32Param('value', value));

  return TransferSingleEvent;
}

export function generateUpdatePodAdmin(podId: i32, admin: string): UpdatePodAdmin {
  let mockEvent = newMockEvent();
  let UpdatePodAdminEvent = new UpdatePodAdmin(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );

  UpdatePodAdminEvent.parameters.push(I32Param('podId', podId));
  UpdatePodAdminEvent.parameters.push(AddressParam('admin', admin));

  return UpdatePodAdminEvent;
}

export function generateUpdatePodAdminV1(podId: i32, admin: string): UpdatePodAdminV1 {
  let mockEvent = newMockEvent();
  let UpdatePodAdminEvent = new UpdatePodAdminV1(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );

  UpdatePodAdminEvent.parameters.push(I32Param('podId', podId));
  UpdatePodAdminEvent.parameters.push(AddressParam('admin', admin));

  return UpdatePodAdminEvent;
}

export function generateDeregisterPod(podId: i32): DeregisterPod {
  let mockEvent = newMockEvent();
  let DeregisterPodEvent = new DeregisterPod(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );

  DeregisterPodEvent.parameters.push(I32Param('podId', podId));

  return DeregisterPodEvent;
}
