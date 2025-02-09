import { useModel } from '@umijs/max';
import { Space } from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';
import styles from './index.less';
export type SiderTheme = 'light' | 'dark';
const GlobalHeaderRight: React.FC = () => {
  // const { initialState } = useModel('@@initialState');
  // if (!initialState || !initialState.settings) {
  //   return null;
  // }
  // const { navTheme, layout } = initialState.settings;
  let className = styles.right;
  className = `${styles.right}  ${styles.dark}`;

  // if ((navTheme === 'realDark' && layout === 'top') || layout === 'mix') {
  // }
  return (
    <Space className={className}>
      <Avatar />
    </Space>
  );
};
export default GlobalHeaderRight;
