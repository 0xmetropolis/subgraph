import { clearStore, test, assert } from "matchstick-as/assembly/index";
import { handleCreatePod, handleMigrateMemberController, handleTransferSingle } from "../src/mapping";
import { generateCreatePod, generateMigrateMemberController, generateTransferSingle, generateUpdatePodAdmin } from "./eventGenerators";
import { log } from "matchstick-as/assembly/log";
import { User, PodUser } from "../generated/schema";
import { addressZero, addressOne, addressTwo, addressThree } from "./fixtures";

export function runTests(): void {
  test("CreateSafe should create a Pod entity", () => {
    let createSafeEvent = generateCreatePod(1, addressOne, addressTwo, 'test.pod.xyz');
    handleCreatePod(createSafeEvent);

    // Honestly don't know where this field comes from, I guess the test auto-gens a contract address.
    assert.fieldEquals('Pod', '1', 'controller', '0xa16081f360e3847006db660bae1c6d1b2e17ec2a');
    clearStore();
  });

  test("MigrateMemberController should update the controller field", () => {
    let createSafeEvent = generateCreatePod(1, addressOne, addressTwo, 'test.pod.xyz');
    handleCreatePod(createSafeEvent);

    let migrateMemberControllerEvent = generateMigrateMemberController(1, addressThree);
    handleMigrateMemberController(migrateMemberControllerEvent);
    // It's the same as address3, just lowercased instead of checksum.
    // string.toLowerCase() doesn't work in assemblyscript.
    assert.fieldEquals('Pod', '1', 'controller', '0x7f4cc354b3b106006781acdad7793b51d7f8636d');
    clearStore();
  })

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

  test('TransferSingle should remove the existing UserPod entity when token is transferred out', () => {
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
    assert.notInStore('PodUser', addressOne + '-1');
    clearStore();
  });

  test('TransferSingle should not create any entities for addressZero', () => {
    let fromUser = new User(addressOne);
    fromUser.save();
    let userPod = new PodUser(addressOne + '-1');
    userPod.save();
  
    // Burn a token, i.e., transfer to addressZero
    let transferSingle = generateTransferSingle(
      addressOne,
      addressOne,
      addressZero,
      1,
      1,
    );

    handleTransferSingle(transferSingle);
    assert.notInStore('PodUser', addressZero + '-1');
    assert.notInStore('User', addressZero);
    clearStore();
  });

  test('A user should be show up in multiple pods', () => {
    let createSafeEvent = generateCreatePod(1, addressOne, addressTwo, 'test.pod.xyz');
    handleCreatePod(createSafeEvent);

    let createSafeEvent2 = generateCreatePod(2, addressOne, addressTwo, 'test-01.pod.xyz');
    handleCreatePod(createSafeEvent2);

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

    assert.fieldEquals('Pod', '1', 'controller', '0xa16081f360e3847006db660bae1c6d1b2e17ec2a');
    assert.fieldEquals('Pod', '2', 'controller', '0xa16081f360e3847006db660bae1c6d1b2e17ec2a');
    assert.fieldEquals('User', addressOne, 'id', addressOne);
    assert.fieldEquals('PodUser', addressOne + '-1', 'user', addressOne);
    assert.fieldEquals('PodUser', addressOne + '-2', 'user', addressOne);

    clearStore();
  });
}
