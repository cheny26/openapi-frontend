import { Dropdown } from 'antd';
import type { DropDownProps } from 'antd/es/dropdown';
import classNames from 'classnames';
import React from 'react';
import styles from './index.less';

export type HeaderDropdownProps = {
  menuClassName?: string;
  menu: React.ReactNode | (() => React.ReactNode) | any;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
} & Omit<DropDownProps, 'menu'>;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown
    menuClassName={classNames(styles.container, cls)}
    getPopupContainer={(target) => target.parentElement || document.body}
    {...restProps}
  />
);

export default HeaderDropdown;
