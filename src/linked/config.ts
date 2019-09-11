import { FLOW_ITEM } from './enums';
import { generateUUID } from '@/utils';

const getText = (type: number) => {
  if (type === FLOW_ITEM.BEGIN) {
    return '开始流程';
  } else if (type === FLOW_ITEM.END) {
    return '结束流程';
  } else {
    return 'Doing someting.'
  }
} 
const init = [FLOW_ITEM.BEGIN, FLOW_ITEM.JUDGE, FLOW_ITEM.END];
export const flowData = init.map(type => ({
  id: generateUUID(),
  type,
  text: getText(type)
}));