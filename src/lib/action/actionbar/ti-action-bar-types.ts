import { InjectionKey } from 'vue';
import { VisibilityFeature } from '../../';
import {
  ActionBarItem,
  ActionBarItemInfo,
  CommonProps,
  TiMatch,
  Vars,
} from '../../../core';

export type ActionBarPayload = {
  eventName: string;
  payload?: any;
};

export type ActionBarEmitter = {
  (eventName: 'fire', payload?: ActionBarPayload): void;
};

export type ABarState = {
  /**
   * 哪些组是打开的
   *
   * 如果值是个 `open` 则表示这个组被打开，
   * 但是还未计算自动停靠，如果是 `ready 则表示已经
   * 计算出了停靠的后的 CSS，并已经设置了 dom 的 style
   */
  opened: Map<string, ABarItemOpenStatus>;

  /**
   * 上下文变量
   */
  vars: Vars;
};

export type ABarItemOpenStatus = 'opened' | 'ready';
export type ActionBarType = 'action' | 'group' | 'sep';

export type ABarAltDisplay = {
  info: ActionBarItemInfo;
  test?: TiMatch;
};

export type ActionBarProps = CommonProps & {
  // 指明一个名称，可以方便调试的时候区分各个菜单
  name?: string;
  items: ActionBarItem[];
  vars?: Vars;
};

export type ActionBarAspect = 'top' | 'sub';

export type AbstractBarItem = ActionBarItemInfo & {
  uniqKey: string;
  index: number; // 0 base
  depth: number; // 0 base, 0 is top
  axis: string[];
  type: ActionBarType;
  aspect: ActionBarAspect;
  action?: (vars: Vars) => void;
};

export type ABarParsedItem = AbstractBarItem &
  VisibilityFeature & {
    altDisplay?: ABarAltDisplay[];
    items?: ABarParsedItem[];
  };
export type ABarUsedItem = AbstractBarItem & {
  // 建立了自己祖先 uniqKey 列表（不包括自己）
  hidden: boolean;
  disabled: boolean;
  items?: ABarUsedItem[];
};

export const ABAR_STATE: InjectionKey<ABarState> = Symbol('ABAR_STATE');