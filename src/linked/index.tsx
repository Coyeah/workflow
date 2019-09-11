import React, { useState, useCallback, useEffect, createContext } from 'react';
import { Button } from 'antd';
import { FLOW_ITEM } from './enums';
import { Linked, HEAD_KEY_ID } from './workflow';
import { flowData } from './config';
import Route from './processNode/Route';
import Condition from './processNode/Condition';
import WrappedItem from './processNode/WrappedItem';
import { generateUUID, storage } from '@/utils';
import styles from './index.module.less';

export const flowContext = createContext({});
const { Provider } = flowContext;
const key = 'workflow-key';

const LinkedPage: React.FC<any> = (props) => {
  // 数据源
  const [data, setData] = useState(([] as any[]));
  // 工作流
  const [linklist, setLinklist] = useState((null as any));
  // 数据字典
  const [dataMap, setDataMap] = useState({});
  // 数据初始化
  useEffect(() => {
    let data: any[] = storage(key) || flowData;
    setData(data);
    const dataMap = {};
    let linklist = new Linked();
    data.forEach(item => {
      const { id } = item;
      dataMap[id] = {...item};
    });
    data.forEach(item => {
      const { id, nodeFrom, include } = item;
      if (linklist.find(id)) return;
      linklist.insert(id, nodeFrom);
      if (include && include.length > 0) {
        include.forEach((key: string) => {
          linklist.insert(key, id, true);
        });
      }
    });
    setDataMap(dataMap);
    setLinklist(linklist);
  }, []);
  // 添加节点
  const addRoute = useCallback((key: string) => {
    let newId = generateUUID();
    linklist.insert(newId, key);
    const map = {...dataMap};
    map[newId] = {
      id: newId,
      type: FLOW_ITEM.JUDGE,
      nodeFrom: key,
    };
    setData([...data, map[newId]]);
    setDataMap(map);
  }, [linklist, dataMap, data]);
  // 添加条件
  const addCondition = useCallback((key: string, isCondition?: boolean) => {
    let newId = generateUUID();
    const map = {...dataMap};
    const tempData = [...data];
    if (isCondition) {
      linklist.insert(newId, key, true);
      map[newId] = {
        id: newId,
        type: FLOW_ITEM.CONDITION,
        nodeFrom: key,
      }
      tempData.push(map[newId]);
    } else {
      let children = [generateUUID(), generateUUID()];
      map[newId] = {
        id: newId,
        type: FLOW_ITEM.CONDITION,
        include: children,
        nodeFrom: key,
      };
      tempData.push(map[newId]);
      linklist.insert(newId, key);
      children.forEach(childId => {
        linklist.insert(childId, newId, true);
        map[childId] = {
          id: childId,
          type: FLOW_ITEM.JUDGE,
          nodeFrom: newId,
        }
        tempData.push(map[childId]);
      });
    }
    setData(tempData);
    setDataMap(map);
  }, [linklist, dataMap, data]);
  // 删除节点
  const delRoute = useCallback((key: string) => {
    linklist.remove(key);
    const map = {...dataMap};
    delete map[key];
    let tempData = data.filter(item => item.id !== key);
    setData(tempData);
    setDataMap(map);
  }, [linklist, dataMap]);

  linklist && linklist.display();

  // 保存数据
  const onSave = useCallback(() => {
    let saveData: any[] = [];
    linklist && linklist.forEach((id: string) => {
      saveData.push(dataMap[id]);
    });
    console.log(saveData);
    // storage(key, saveData);
  }, [data, dataMap, linklist]);

  // console.info(data);

  const restProps = {
    addRoute,
    addCondition,
    delRoute
  }
  return (
    <div style={{ width: 'max-content', minWidth: '100%' }}>
      <Provider value={{dataMap, action: setDataMap}}>
        {linklist && linklist.render({
          route: Route,
          condition: Condition,
          conditionItem: WrappedItem,
          routeProps: restProps,
          conditionProps: restProps,
        })}
      </Provider>
      <div className={styles.submit}>
        <Button type="primary" onClick={onSave} >保存</Button>
      </div>
    </div>
  )
}

export default LinkedPage;