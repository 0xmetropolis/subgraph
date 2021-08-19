import { clearStore, test, assert } from "matchstick-as/assembly/index";
import { handleCreateSafe, handleTransferSingle } from "../src/mapping";
import { generateCreateSafe, generateTransferSingle } from "./eventGenerators";
import { log } from "matchstick-as/assembly/log";
import { User } from "../generated/schema";

const addressZero = '0x0000000000000000000000000000000000000000';
const addressOne = '0x165fa0840660fffd39e28f7c880f96fc479fe5e6';
const addressTwo = '0x636891923cbf801b493ed495bd182689fde1ffe5';
const addressThree = '0x7f4Cc354b3b106006781acdad7793b51d7f8636d';

export function runTests(): void {
  test("CreateSafe should create a Pod entity", () => {
    let createSafeEvent = generateCreateSafe(1, addressOne);
    handleCreateSafe(createSafeEvent);

    assert.fieldEquals('Pod', '1', 'safe', addressOne);
    clearStore();
    // Bug fix for matchstick
    createSafeEvent.parameters.splice(0, 100);
  });

  test('TransferSingle should create a User entity', () => {
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
    assert.fieldEquals('User', addressOne, 'pods', '[1]');
    clearStore();
    transferSingleEvent.parameters.splice(0, 100);
  });

  test('TransferSingle should remove a pod from a User entity', () => {
    let fromUser = new User(addressOne);
    fromUser.pods = ['1', '2', '3',];
    fromUser.save();
    // Transfer token from AddressOne to addressTwo
    let transferSingle = generateTransferSingle(
      addressOne,
      addressOne,
      addressTwo,
      1,
      1,
    );
    
    handleTransferSingle(transferSingle);
    assert.fieldEquals('User', addressOne, 'pods', '[2, 3]');
    assert.fieldEquals('User', addressTwo, 'pods', '[1]');
    clearStore();
    transferSingle.parameters.splice(0, 100);
  }); 
}
