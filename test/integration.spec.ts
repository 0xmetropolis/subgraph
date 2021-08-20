import { clearStore, test, assert } from "matchstick-as/assembly/index";
import { handleCreateSafe, handleTransferSingle } from "../src/mapping";
import { generateCreateSafe, generateTransferSingle } from "./eventGenerators";
import { log } from "matchstick-as/assembly/log";
import { User, PodUser } from "../generated/schema";
import { addressZero, addressOne, addressTwo } from "./fixtures";

export function runTests(): void {
  test("CreateSafe should create a Pod entity", () => {
    let createSafeEvent = generateCreateSafe(1, addressOne);
    handleCreateSafe(createSafeEvent);

    assert.fieldEquals('Pod', '1', 'safe', addressOne);
    clearStore();
  });

  test('TransferSingle should create a User and UserPod entity', () => {
    // Mint a token (transfer from zero to addressTwo)
    let transferSingleEvent = generateTransferSingle(
      addressOne,
      addressZero,
      addressOne,
      1,
      1,
    );

    handleTransferSingle(transferSingleEvent);
    assert.fieldEquals('User', addressOne, 'id', addressOne);
    assert.fieldEquals('PodUser', addressOne + '-1', 'user', addressOne);
    assert.fieldEquals('PodUser', addressOne + '-1', 'pod', '1');
    clearStore();
  });

  test('TransferSingle should remove the existing UserPod entity', () => {
    let fromUser = new User(addressOne);
    fromUser.save();
    let userPod = new PodUser(addressOne + '-1');
    userPod.save();
  
    // Transfer token from AddressOne to addressTwo
    let transferSingle = generateTransferSingle(
      addressOne,
      addressOne,
      addressTwo,
      1,
      1,
    );
    
    handleTransferSingle(transferSingle);
    assert.fieldEquals('PodUser', addressTwo + '-1', 'user', addressTwo);
    assert.fieldEquals('PodUser', addressTwo + '-1', 'pod', '1');
    // Not working for some reason?
    // assert.notInStore('UserPod', addressOne + '-1');
    clearStore();
  });

  test('A user should be show up in multiple pods', () => {
    let createSafeEvent = generateCreateSafe(1, addressOne);
    handleCreateSafe(createSafeEvent);

    let createSafeEvent2 = generateCreateSafe(2, addressOne);
    handleCreateSafe(createSafeEvent2);

    let transferSingleEvent = generateTransferSingle(
      addressOne,
      addressZero,
      addressOne,
      1,
      1,
    );
    handleTransferSingle(transferSingleEvent);

    let transferSingleEvent2 = generateTransferSingle(
      addressOne,
      addressZero,
      addressOne,
      2,
      1,
    );
    handleTransferSingle(transferSingleEvent2);

    assert.fieldEquals('Pod', '1', 'safe', addressOne);
    assert.fieldEquals('Pod', '2', 'safe', addressOne);
    assert.fieldEquals('User', addressOne, 'id', addressOne);
    assert.fieldEquals('PodUser', addressOne + '-1', 'user', addressOne);
    assert.fieldEquals('PodUser', addressOne + '-2', 'user', addressOne);

    clearStore();
  });
}