import React from 'react';
import styles from './index.module.less';

const WrappedItem: React.FC = ({ children }) => {
  return (
    <div className={styles['work-flow-condition-routes']}>
      {children}
    </div>
  )
}

export default WrappedItem;