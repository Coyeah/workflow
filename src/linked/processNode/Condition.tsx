import React, { useContext, useRef, useEffect, ElementType, useState } from 'react';
import { Input, Popover, Button } from 'antd';
import classNames from 'classnames';
import { flowContext } from '../index';
import { FLOW_ITEM } from '../enums';
import styles from './index.module.less';

interface IProps {
  id: string;
  addRoute: (id: string) => void;
  addCondition: (id: string, isCondition?: boolean) => void;
  delRoute: (id: string) => void;
}

const Condition: React.FC<IProps> = ({
  id,
  addRoute,
  addCondition,
  delRoute,
  children
}) => {
  const dataMap: any = useContext(flowContext);
  const [size, setSize] = useState({
    left: 0,
    right: 0
  });
  const divRef = useRef(null);
  useEffect(() => {
    if (divRef.current !== null) {
      const dom = divRef.current as any;
      const first = dom.childNodes[4], last = dom.lastChild;
      const size = {
        left: first.offsetWidth / 2 - 1,
        right: last.offsetWidth / 2 - 1,
      }
      setSize(size);
    }
  }, [dataMap]);
  // console.info(`Condition: ${id}: `, dataMap[id]);
  const content = (
    <div style={{width: 'max-content'}}>
      <div><a onClick={() => addRoute(id)}>添加节点</a></div>
      <a onClick={() => addCondition(id)}>添加条件</a>
    </div>
  );
  return (
    <div className={styles.wrapped}>
      <div className={styles.condition} >
        <div className={styles.content}>
          <span><b>Condition</b> - {id.slice(0, 5)}</span>
          <a onClick={() => addCondition(id, true)}>添加条件</a>
          <a onClick={() => delRoute(id)}>删除条件</a>
        </div>
        <div className={styles.children} ref={divRef}>
          <header className={styles['line-top-left']} style={{width: size.left}} />
          <header className={styles['line-bottom-left']} style={{width: size.left}} />
          <header className={styles['line-top-right']} style={{width: size.right}} />
          <header className={styles['line-bottom-right']} style={{width: size.right}} />
          {children}
        </div>
      </div>
      <div className={styles.line}>
        <Popover content={content}>
          <Button type="primary" shape="round" icon="plus" size="small" />
        </Popover>
      </div>
    </div>
  )
}

export default Condition;