import {
  clearStore,
  test,
  assert,
  describe,
} from "matchstick-as/assembly/index";
import {
  handleTransferSingle,
  handleUpdatePodAdminV1_4,
  handleDeregisterPod,
  handleTransferBatch,
} from "../src/mapping";
import {
  generateDeregisterPodV1_4,
  generateTransferSingle,
  generateTransferBatch,
  generateUpdatePodAdmin,
  generateUpdatePodAdminV1,
} from "./eventGenerators";
import { log } from "matchstick-as/assembly/log";
import { User, PodUser } from "../generated/schema";
import { addressZero, addressOne, addressTwo, addressThree } from "./fixtures";

describe("TransferSingle", () => {
  test("TransferSingle should create a Pod, User, and UserPod entity", () => {
    // Mint a token (transfer from zero to addressTwo)
    let transferSingleEvent = generateTransferSingle(
      addressOne,
      addressZero,
      addressOne,
      1,
      1
    );

    handleTransferSingle(transferSingleEvent);
    assert.fieldEquals("Pod", "1", "id", "1");
    // Admin should always be null for a fresh pod on creation.
    // Updating should be handled by UpdatePodAdmin, not this function.
    assert.fieldEquals("Pod", "1", "admin", addressZero);
    assert.fieldEquals("User", addressOne, "id", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-1", "user", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-1", "pod", "1");
    clearStore();
  });

  test("TransferSingle should remove the existing UserPod entity when token is transferred out", () => {
    let fromUser = new User(addressOne);
    fromUser.adminPods = [addressTwo];
    fromUser.save();

    let userPod = new PodUser(addressOne + "-1");
    userPod.user = addressOne;
    userPod.pod = "1";
    userPod.save();

    // Transfer token from AddressOne to addressTwo
    let transferSingle = generateTransferSingle(
      addressOne,
      addressOne,
      addressTwo,
      1,
      1
    );

    handleTransferSingle(transferSingle);
    assert.fieldEquals("PodUser", addressTwo + "-1", "user", addressTwo);
    assert.fieldEquals("PodUser", addressTwo + "-1", "pod", "1");
    assert.notInStore("PodUser", addressOne + "-1");
    clearStore();
  });

  test("TransferSingle should not create any entities for addressZero", () => {
    let fromUser = new User(addressOne);
    fromUser.adminPods = [addressTwo];
    fromUser.save();
    let userPod = new PodUser(addressOne + "-1");
    userPod.user = addressOne;
    userPod.pod = "1";
    userPod.save();

    // Burn a token, i.e., transfer to addressZero
    let transferSingle = generateTransferSingle(
      addressOne,
      addressOne,
      addressZero,
      1,
      1
    );

    handleTransferSingle(transferSingle);
    assert.notInStore("PodUser", addressZero + "-1");
    assert.notInStore("User", addressZero);
    clearStore();
  });

  test("A user can exist in multiple pods", () => {
    let transferSingleEvent = generateTransferSingle(
      addressOne,
      addressZero,
      addressOne,
      1,
      1
    );
    handleTransferSingle(transferSingleEvent);

    let transferSingleEvent2 = generateTransferSingle(
      addressOne,
      addressZero,
      addressOne,
      2,
      1
    );
    handleTransferSingle(transferSingleEvent2);

    assert.fieldEquals("User", addressOne, "id", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-1", "user", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-2", "user", addressOne);

    clearStore();
  });
});

describe("TransferBatch", () => {
  test("TransferBatch should create a Pod, User, and UserPod entity", () => {
    // Mint a token (transfer from zero to addressTwo)
    let transferBatchEvent = generateTransferBatch(
      addressOne,
      addressZero,
      addressOne,
      [1, 2], // ids
      [1, 2] // amounts
    );

    handleTransferBatch(transferBatchEvent);
    assert.fieldEquals("Pod", "1", "id", "1");
    // Admin should always be null for a fresh pod on creation.
    // Updating should be handled by UpdatePodAdmin, not this function.
    assert.fieldEquals("Pod", "1", "admin", addressZero);
    assert.fieldEquals("User", addressOne, "id", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-1", "user", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-1", "pod", "1");
    clearStore();
  });

  test("TransferBatch should remove the existing UserPod entity when token is transferred out", () => {
    let userPod1 = new PodUser(addressOne + "-1");
    userPod1.user = addressOne;
    userPod1.pod = "1";
    userPod1.save();

    let userPod2 = new PodUser(addressOne + "-2");
    userPod2.user = addressOne;
    userPod2.pod = "2";
    userPod2.save();

    // Transfer multiple tokens from addressOne to addressTwo
    let transferBatch = generateTransferBatch(
      addressOne,
      addressOne,
      addressTwo,
      [1, 2],
      [1, 1]
    );

    assert.fieldEquals("PodUser", addressOne + "-1", "user", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-1", "pod", "1");
    handleTransferBatch(transferBatch);
    assert.fieldEquals("PodUser", addressTwo + "-1", "user", addressTwo);
    assert.fieldEquals("PodUser", addressTwo + "-1", "pod", "1");
    assert.notInStore("PodUser", addressOne + "-1");
    clearStore();
  });

  test("TransferBatch should not create any entities for addressZero", () => {
    let fromUser = new User(addressOne);
    fromUser.adminPods = [addressTwo];
    fromUser.save();

    let userPod1 = new PodUser(addressOne + "-1");
    userPod1.user = addressOne;
    userPod1.pod = "1";
    userPod1.save();

    let userPod2 = new PodUser(addressOne + "-2");
    userPod2.user = addressOne;
    userPod2.pod = "2";
    userPod2.save();

    // Burn two tokens, i.e., transfer to addressZero
    let transferBatch = generateTransferBatch(
      addressOne,
      addressOne,
      addressZero,
      [1, 2],
      [1, 1]
    );

    assert.fieldEquals("PodUser", addressOne + "-1", "user", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-1", "pod", "1");
    handleTransferBatch(transferBatch);
    assert.notInStore("PodUser", addressZero + "-1");
    assert.notInStore("User", addressZero);
    clearStore();
  });

  test("A user can exist in multiple pods", () => {
    let transferBatchEvent = generateTransferBatch(
      addressOne,
      addressZero,
      addressOne,
      [1, 2],
      [1, 1]
    );
    handleTransferBatch(transferBatchEvent);

    assert.fieldEquals("User", addressOne, "id", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-1", "user", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-2", "user", addressOne);

    clearStore();
  });
});

describe("DeregisterPod", () => {
  test("DeregisterPod should delete the pod entity", () => {
    // Create a pod
    let transferSingleEvent = generateTransferSingle(
      addressOne,
      addressZero,
      addressOne,
      119,
      1
    );
    handleTransferSingle(transferSingleEvent);

    assert.fieldEquals("Pod", "119", "id", "119");
    assert.fieldEquals("User", addressOne, "adminPods", "[]");
    // Updating should be handled by UpdatePodAdmin, not this function.
    assert.fieldEquals("User", addressOne, "id", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-119", "user", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-119", "pod", "119");

    let deregisterPodEvent = generateDeregisterPodV1_4(119);
    handleDeregisterPod(deregisterPodEvent);

    // Pod and PodUser should be deleted
    assert.notInStore("Pod", "119");
    assert.notInStore("PodUser", addressOne + "-119");

    assert.fieldEquals("User", addressOne, "id", addressOne);
    assert.fieldEquals("User", addressOne, "adminPods", "[]");

    clearStore();
  });

  test("DeregisterPod should only delete that one pod for a user in many", () => {
    // Create a pod
    let transferBatchEvent = generateTransferBatch(
      addressOne,
      addressZero,
      addressOne,
      [1, 2],
      [1, 1]
    );
    handleTransferBatch(transferBatchEvent);

    assert.fieldEquals("User", addressOne, "id", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-1", "user", addressOne);
    assert.fieldEquals("PodUser", addressOne + "-2", "user", addressOne);

    let deregisterPodEvent = generateDeregisterPodV1_4(1);
    handleDeregisterPod(deregisterPodEvent);

    assert.notInStore("Pod", "1");
    assert.notInStore("PodUser", addressOne + "-1");
    assert.fieldEquals("Pod", "2", "id", "2");
    assert.fieldEquals("PodUser", addressOne + "-2", "user", addressOne);

    clearStore();
  });
});
