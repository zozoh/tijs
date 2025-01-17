import { InjectionKey } from 'vue';
import { VisibilityFeature } from '../../';
import {
  ActionBarItem,
  ActionBarItemInfo,
  AspectSize,
  CommonProps,
  CssAlignment,
  IconInput,
  TextContentType,
  TiAppBus,
  TiMatch,
  Vars,
} from '../../../_type';

export type ActionBarEvent = {
  name: string;
  payload?: any;
};

export type ActionBarEmitter = {
  (eventName: 'fire', barEvent: ActionBarEvent): void;
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
export type ActionBarLayoutMode = 'H' | 'V';
export type BarTopItemAspectMode = 'normal' | 'button';

export type ABarAltDisplay = {
  info: ActionBarItemInfo;
  test?: TiMatch;
};

export type ActionBarText = CommonProps & {
  textType?: TextContentType;
  text?: string;
  style?: Vars;
  icon?: IconInput;
  comType?: string;
  comConf?: Vars;
};

export type ActionBarProps = CommonProps & {
  // 指明一个名称，可以方便调试的时候区分各个菜单
  name?: string;
  items?: ActionBarItem[];
  vars?: Vars;
  style?: Vars;
  layoutMode?: ActionBarLayoutMode;
  topItemAspectMode?: BarTopItemAspectMode;
  /**
   * 顶级按钮最小宽度
   */
  topItemMinWidth?: string;

  head?: ActionBarText;
  tail?: ActionBarText;

  /**
   * 选项间距
   */
  barPad?: AspectSize | 'none';

  /**
   * 选项字体大小
   */
  itemSize?: AspectSize;

  /**
   * 顶级菜单项目的排列
   */
  itemAlign?: CssAlignment;

  /**
   * 选项圆角
   */
  itemRadius?: AspectSize | 'none';
};

type ActionBarAspect = 'top' | 'sub';

export type AbstractBarItem = ActionBarItemInfo & {
  uniqKey: string;
  index: number; // 0 base
  depth: number; // 0 base, 0 is top
  axis: string[];
  type: ActionBarType;
  aspect: ActionBarAspect;
  layoutMode: ActionBarLayoutMode;
  action?: (vars: Vars, bus?: TiAppBus) => void;
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
