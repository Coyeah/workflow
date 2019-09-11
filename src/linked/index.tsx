import React, { useState, useCallback, useEffect, createContext } from 'react';
import { FLOW_ITEM } from './enums';
import { Linked, HEAD_KEY_ID } from './workflow';
import { flowData } from './config';
import Route from './processNode/Route';
import Condition from './processNode/Condition';
import WrappedItem from './processNode/WrappedItem';
import { generateUUID } from '@/utils';

export const flowContext = createContext({});
const { Provider } = flowContext;

const LinkedPage: React.FC<any> = (props) => {
  const [linklist, setLinklist] = useState((null as any));
  const [dataMap, setDataMap] = useState({});
  useEffect(() => {
    const dataMap = {};
    let linklist = new Linked();
    flowData.forEach((item, index) => {
      const { id, ...restData } = item;
      dataMap[id] = {...restData};
      linklist.insert(id, index === 0 ? null : flowData[index-1].id);
    });
    setDataMap(dataMap);
    setLinklist(linklist);
  }, []);

  const addRoute = useCallback((key: string) => {
    let newId = generateUUID();
    linklist.insert(newId, key);
    const map = {...dataMap};
    map[newId] = {
      id: newId,
      type: FLOW_ITEM.JUDGE
    };
    setDataMap(map);
  }, [linklist, dataMap]);
  const addCondition = useCallback((key: string, isCondition?: boolean) => {
    let newId = generateUUID();
    const map = {...dataMap};
    if (isCondition) {
      linklist.insert(newId, key, true);
      map[newId] = {
        id: newId,
        type: FLOW_ITEM.CONDITION
      }
    } else {
      let children = [generateUUID(), generateUUID()];
      map[newId] = {
        id: newId,
        type: FLOW_ITEM.CONDITION,
        include: children
      };
      linklist.insert(newId, key);
      children.forEach(id => {
        linklist.insert(id, newId, true);
        map[id] = {
          id,
          type: FLOW_ITEM.CONDITION
        }
      });
    }
    setDataMap(map);
  }, [linklist, dataMap]);
  const delRoute = useCallback((key: string) => {
    linklist.remove(key);
    const map = {...dataMap};
    delete map[key];
    setDataMap(map);
  }, [linklist, dataMap]);

  // linklist && linklist.display();

  const restProps = {
    addRoute,
    addCondition,
    delRoute
  }
  return (
    <div style={{ width: 'max-content', minWidth: '100%' }}>
      <Provider value={dataMap}>
        {linklist && linklist.render({
          route: Route,
          condition: Condition,
          conditionItem: WrappedItem,
          routeProps: restProps,
          conditionProps: restProps,
        })}
      </Provider>
    </div>
  )
}

export default LinkedPage;