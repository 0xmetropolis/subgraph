import { ethereum, Address } from '@graphprotocol/graph-ts';
import { clearStore, test, assert, newMockEvent } from "matchstick-as/assembly/index";
import { TransferSingle } from '../generated/MemberToken/MemberToken';
import { 
  CreateSafe,
} from '../generated/SafeTeller/SafeTeller';

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

export function generateCreateSafe(id: i32, safeAddress: string): CreateSafe {
  let CreateSafeEvent = new CreateSafe();

  CreateSafeEvent.parameters.push(I32Param(id));
  CreateSafeEvent.parameters.push(AddressParam(safeAddress));

  return newMockEvent(CreateSafeEvent) as CreateSafe;
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
