import { clearStore, test, assert } from "matchstick-as/assembly/index";
import { handleTransferSingle, handleUpdatePodAdmin, handleUpdatePodAdminV1 } from "../src/mapping";
import { generateTransferSingle, generateUpdatePodAdmin, generateUpdatePodAdminV1 } from "./eventGenerators";
import { addressZero, addressOne, addressTwo, addressThree } from "./fixtures";

test('UpdatePodAdmin adds and removes ids to/from adminPods', () => {
  let transferSingleEvent1 = generateTransferSingle(
    addressOne,
    addressZero,
    addressOne,
    1,
    1,
  );

  let updatePodAdminEvent1 = generateUpdatePodAdmin(1, addressOne);

  let transferSingleEvent2 = generateTransferSingle(
    addressOne,
    addressZero,
    addressOne,
    2,
    1,
  );

  let updatePodAdminEvent2 = generateUpdatePodAdmin(2, addressOne);
  let updatePodAdminEvent3 = generateUpdatePodAdmin(1, addressTwo);

  // Create Pod 1 and make User admin
  handleTransferSingle(transferSingleEvent1);
  handleUpdatePodAdmin(updatePodAdminEvent1);
  assert.fieldEquals('User', addressOne, 'adminPods', '[1]');
  assert.fieldEquals('Pod', '1', 'admin', addressOne);

  // Create Pod 2 and make User admin
  handleTransferSingle(transferSingleEvent2);
  handleUpdatePodAdmin(updatePodAdminEvent2);
  assert.fieldEquals('User', addressOne, 'adminPods', '[1, 2]');
  assert.fieldEquals('Pod', '1', 'admin', addressOne);
  assert.fieldEquals('Pod', '2', 'admin', addressOne);

  // Update the admin for Pod 1
  handleUpdatePodAdmin(updatePodAdminEvent3);
  assert.fieldEquals('User', addressOne, 'adminPods', '[2]');
  assert.fieldEquals('Pod', '1', 'admin', addressTwo);
  clearStore();
});

test('UpdatePodAdmin - admin pods should be empty if admin is removed', () => {
  let transferSingleEvent1 = generateTransferSingle(
    addressOne,
    addressZero,
    addressOne,
    1,
    1,
  );

  let updatePodAdminEvent1 = generateUpdatePodAdmin(1, addressOne);

  let updatePodAdminEvent3 = generateUpdatePodAdmin(1, addressTwo);

  // Create Pod 1 and make User admin
  handleTransferSingle(transferSingleEvent1);
  handleUpdatePodAdmin(updatePodAdminEvent1);
  assert.fieldEquals('User', addressOne, 'adminPods', '[1]');
  assert.fieldEquals('Pod', '1', 'admin', addressOne);

  // Update the admin for Pod 1
  handleUpdatePodAdmin(updatePodAdminEvent3);
  assert.fieldEquals('User', addressOne, 'adminPods', '[]');
  assert.fieldEquals('Pod', '1', 'admin', addressTwo);
  clearStore();
});

test('UpdatePodAdmin works if user has not been instantiated', () => {
  let transferSingleEvent = generateTransferSingle(
    addressOne,
    addressZero,
    addressOne,
    1,
    1,
  );
  let updatePodAdminEvent = generateUpdatePodAdmin(1, addressTwo);

  handleTransferSingle(transferSingleEvent);
  handleUpdatePodAdmin(updatePodAdminEvent);
  assert.fieldEquals('User', addressTwo, 'adminPods', '[1]');
});

test('UpdatePodAdmin add pod across Controllers', () => {
  let transferSingleEvent1 = generateTransferSingle(
    addressOne,
    addressZero,
    addressOne,
    1,
    1,
  );

  let updatePodAdminEvent1 = generateUpdatePodAdmin(1, addressOne);

  let transferSingleEvent2 = generateTransferSingle(
    addressOne,
    addressZero,
    addressOne,
    2,
    1,
  );

  let updatePodAdminEvent2 = generateUpdatePodAdminV1(2, addressOne);
  let updatePodAdminEvent3 = generateUpdatePodAdminV1(1, addressTwo);

  // Create Pod 1 and make User admin
  handleTransferSingle(transferSingleEvent1);
  handleUpdatePodAdmin(updatePodAdminEvent1);
  assert.fieldEquals('User', addressOne, 'adminPods', '[1]');
  assert.fieldEquals('Pod', '1', 'admin', addressOne);

  // Create Pod 2 and make User admin
  handleTransferSingle(transferSingleEvent2);
  handleUpdatePodAdminV1(updatePodAdminEvent2);
  assert.fieldEquals('User', addressOne, 'adminPods', '[1, 2]');
  assert.fieldEquals('Pod', '1', 'admin', addressOne);
  assert.fieldEquals('Pod', '2', 'admin', addressOne);

  // Update the admin for Pod 1
  handleUpdatePodAdminV1(updatePodAdminEvent3);
  assert.fieldEquals('User', addressOne, 'adminPods', '[2]');
  assert.fieldEquals('Pod', '1', 'admin', addressTwo);
  clearStore();
});

test('UpdatePodAdmin remove pod across Controllers', () => {
  let transferSingleEvent1 = generateTransferSingle(
    addressOne,
    addressZero,
    addressOne,
    1,
    1,
  );

  let updatePodAdminEvent1 = generateUpdatePodAdmin(1, addressOne);

  let transferSingleEvent2 = generateTransferSingle(
    addressOne,
    addressZero,
    addressOne,
    2,
    1,
  );

  let updatePodAdminEvent2 = generateUpdatePodAdmin(2, addressOne);
  let updatePodAdminEvent3 = generateUpdatePodAdminV1(1, addressTwo);

  // Create Pod 1 and make User admin
  handleTransferSingle(transferSingleEvent1);
  handleUpdatePodAdmin(updatePodAdminEvent1);
  assert.fieldEquals('User', addressOne, 'adminPods', '[1]');
  assert.fieldEquals('Pod', '1', 'admin', addressOne);

  // Create Pod 2 and make User admin
  handleTransferSingle(transferSingleEvent2);
  handleUpdatePodAdmin(updatePodAdminEvent2);
  assert.fieldEquals('User', addressOne, 'adminPods', '[1, 2]');
  assert.fieldEquals('Pod', '1', 'admin', addressOne);
  assert.fieldEquals('Pod', '2', 'admin', addressOne);

  // Update the admin for Pod 1
  handleUpdatePodAdminV1(updatePodAdminEvent3);
  assert.fieldEquals('User', addressOne, 'adminPods', '[2]');
  assert.fieldEquals('Pod', '1', 'admin', addressTwo);
  clearStore();
});
