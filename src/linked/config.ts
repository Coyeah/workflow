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

let begin = generateUUID(), end = generateUUID(), judge = generateUUID();

const initMap = {
  [begin]: {
    id: begin,
    type: FLOW_ITEM.BEGIN,
    text: '开始流程',
    include: undefined,
    nodeFrom: null
  },
  [judge]: {
    id: judge,
    type: FLOW_ITEM.JUDGE,
    text: '做点什么',
    include: undefined,
    nodeFrom: begin
  },
  [end]: {
    id: end,
    type: FLOW_ITEM.END,
    text: '结束流程',
    include: undefined,
    nodeFrom: judge
  }
}

export const flowData = Object.keys(initMap).map(key => ({
  ...initMap[key]
}))