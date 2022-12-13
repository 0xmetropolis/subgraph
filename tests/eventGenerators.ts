import { ethereum, Address } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";
import {
  TransferSingle,
  TransferBatch,
} from "../generated/MemberToken/MemberToken";
import { UpdatePodAdmin } from "../generated/Controller/Controller";
import { UpdatePodAdmin as UpdatePodAdminV1 } from "../generated/ControllerV1/ControllerV1";
import { DeregisterPod as DeregisterPodV1_3 } from "../generated/ControllerV1_4/ControllerV1_4";
import { DeregisterPod as DeregisterPodV1_4 } from "../generated/ControllerV1_4/ControllerV1_4";

// Generates events for test purposes

function AddressParam(label: string, address: string): ethereum.EventParam {
  let param = new ethereum.EventParam(
    label,
    ethereum.Value.fromAddress(Address.fromString(address))
  );
  return param;
}

function I32ArrayParam(label: string, input: Array<i32>): ethereum.EventParam {
  let param = new ethereum.EventParam(
    label,
    ethereum.Value.fromI32Array(input)
  );
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

export function generateTransferSingle(
  operator: string,
  from: string,
  to: string,
  id: i32,
  value: i32
): TransferSingle {
  let mockEvent = newMockEvent();
  let TransferSingleEvent = new TransferSingle(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  TransferSingleEvent.parameters.push(AddressParam("operator", operator));
  TransferSingleEvent.parameters.push(AddressParam("from", from));
  TransferSingleEvent.parameters.push(AddressParam("to", to));
  TransferSingleEvent.parameters.push(I32Param("id", id));
  TransferSingleEvent.parameters.push(I32Param("value", value));

  return TransferSingleEvent;
}

//emit TransferBatch(operator, from, to, ids, amounts);
export function generateTransferBatch(
  operator: string,
  from: string,
  to: string,
  ids: i32[],
  values: i32[]
): TransferBatch {
  let mockEvent = newMockEvent();
  let TransferBatchEvent = new TransferBatch(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  TransferBatchEvent.parameters.push(AddressParam("operator", operator));
  TransferBatchEvent.parameters.push(AddressParam("from", from));
  TransferBatchEvent.parameters.push(AddressParam("to", to));
  TransferBatchEvent.parameters.push(I32ArrayParam("ids", ids));
  TransferBatchEvent.parameters.push(I32ArrayParam("value", values));

  return TransferBatchEvent;
}

export function generateUpdatePodAdmin(
  podId: i32,
  admin: string
): UpdatePodAdmin {
  let mockEvent = newMockEvent();
  let UpdatePodAdminEvent = new UpdatePodAdmin(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  UpdatePodAdminEvent.parameters.push(I32Param("podId", podId));
  UpdatePodAdminEvent.parameters.push(AddressParam("admin", admin));

  return UpdatePodAdminEvent;
}

export function generateUpdatePodAdminV1(
  podId: i32,
  admin: string
): UpdatePodAdminV1 {
  let mockEvent = newMockEvent();
  let UpdatePodAdminEvent = new UpdatePodAdminV1(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  UpdatePodAdminEvent.parameters.push(I32Param("podId", podId));
  UpdatePodAdminEvent.parameters.push(AddressParam("admin", admin));

  return UpdatePodAdminEvent;
}

export function generateDeregisterPodV1_3(podId: i32): DeregisterPodV1_3 {
  let mockEvent = newMockEvent();
  let DeregisterPodEvent = new DeregisterPodV1_3(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  DeregisterPodEvent.parameters.push(I32Param("podId", podId));

  return DeregisterPodEvent;
}

export function generateDeregisterPodV1_4(podId: i32): DeregisterPodV1_4 {
  let mockEvent = newMockEvent();
  let DeregisterPodEvent = new DeregisterPodV1_4(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  DeregisterPodEvent.parameters.push(I32Param("podId", podId));

  return DeregisterPodEvent;
}
