import 'jest';
import '../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById
} from '../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../blockly/state/event.data';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../../constants/arduino';
import { saveSensorSetupBlockData } from '../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../blockly/updater';
import { ArduinoState, ArduinoComponentType } from '../../state/arduino.state';
import { RfidState } from '../../state/arduino-components.state';
import { createArduinoAndWorkSpace } from '../../../../tests/tests.helper';

describe('rfid state factories', () => {
  let workspace: Workspace;
  let rfidBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();

    rfidBlock = workspace.newBlock('rfid_setup');
    rfidBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_7, 'RX');
    rfidBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_6, 'TX');

    rfidBlock.setFieldValue('TRUE', 'scanned_card');
    rfidBlock.setFieldValue('card_num', 'card_number');
    rfidBlock.setFieldValue('tag', 'tag');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: rfidBlock.id
    };
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test('should be able generate state for rfid setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: rfidBlock.id
    };

    const rfidComponent: RfidState = {
      pins: [ARDUINO_UNO_PINS.PIN_7, ARDUINO_UNO_PINS.PIN_6],
      rxPin: ARDUINO_UNO_PINS.PIN_7,
      txPin: ARDUINO_UNO_PINS.PIN_6,
      scannedCard: true,
      cardNumber: 'card_num',
      tag: 'tag',
      type: ArduinoComponentType.RFID
    };

    const rfidSetupState: ArduinoState = {
      blockId: rfidBlock.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up RFID.',
      components: [rfidComponent],
      variables: {},
      txLedOn: false,
      rxLedOn: false,
      sendMessage: '', // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true
    };

    expect(eventToFrameFactory(event)).toEqual([rfidSetupState]);
  });
});