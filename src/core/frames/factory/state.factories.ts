import { BlockData } from '../../blockly/state/block.data';
import { Timeline, ArduinoState } from '../state/arduino.state';
import { rfidSetup } from './rfid';
import { bluetoothSetup } from './bluetooth';
import { messageSetup } from './message';
import { timeSetup } from './time';

export interface StateGenerator {
  (
    blocks: BlockData[],
    block: BlockData,
    timeline: Timeline,
    previousState?: ArduinoState
  ): ArduinoState[];
}

const stateList: { [blockName: string]: StateGenerator } = {
  rfid_setup: rfidSetup,
  bluetooth_setup: bluetoothSetup,
  message_setup: messageSetup,
  time_setup: timeSetup
};

export const generateState: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  return stateList[block.blockName](blocks, block, timeline, previousState);
};