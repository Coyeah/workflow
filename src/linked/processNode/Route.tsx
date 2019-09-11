import React, { useContext } from 'react';
import { Input, Popover, Button } from 'antd';
import classNames from 'classnames';
import { flowContext } from '../index';
import { FLOW_ITEM } from '../enums';
import styles from './index.module.less';

interface IProps {
  id: string;
  addRoute: (id: string) => void;
  addCondition: (id: string) => void;
  delRoute: (id: string) => void;
}

const Route: React.FC<IProps> = ({
  id,
  addRoute,
  addCondition,
  delRoute,
}) => {
  const dataMap: any = useContext(flowContext);
  // console.info(`Route: ${id}: `, dataMap[id]);
  const content = (
    <div style={{width: 'max-content'}}>
      <div><a onClick={() => addRoute(id)}>添加节点</a></div>
      <div><a onClick={() => addCondition(id)}>添加条件</a></div>
    </div>
  );
  const disabled = dataMap[id].type === FLOW_ITEM.BEGIN || dataMap[id].type === FLOW_ITEM.END;
  return (
    <div className={styles.wrapped}>
      <div className={styles.route} >
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div><b>Route</b> - {id.slice(0,5)}</div>
          {!disabled && <div><a onClick={() => delRoute(id)}>删除节点</a></div>}
        </div>
        <Input defaultValue={dataMap[id].text} disabled={disabled} />
      </div>
      {dataMap[id].type !== FLOW_ITEM.END && (
        <div className={styles.line}>
          <Popover content={content}>
            <Button type="primary" shape="round" icon="plus" size="small" />
          </Popover>
        </div>
      )}
    </div>
  ) 
}

export default Route;