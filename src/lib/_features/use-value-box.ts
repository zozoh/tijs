import _ from 'lodash';
import {
  FormatValueProps,
  PlaceholderFeature,
  PlaceholderFeatureProps,
  PrefixSuffixEvents,
  PrefixSuffixFeature,
  PrefixSuffixFeatureProps,
  PrefixSuffixState,
  ValueInputFeature,
  ValueInputProps,
  tiGetDefaultComPropValue,
  useFormatValue,
  usePlaceholder,
  usePrefixSuffix,
  useValueInput,
} from '..';
import { Be, CommonProps, FuncA0, Str } from '../../core';
/*-------------------------------------------------------

                     Emit 

-------------------------------------------------------*/
export type ValueBoxEmits = {
  (event: PrefixSuffixEvents): void;
  (event: 'change', payload: string): void;
};
/*-------------------------------------------------------

                     State

-------------------------------------------------------*/
export type ValueBoxState<T extends any> = PrefixSuffixState & {
  // 逻辑值（隐值）
  boxValue?: T;
  // 输入框的错误消息
  boxErrMsg: string;

  // 双向绑定输入框的真实值
  boxInputing: string;

  // 输入框状态: true 聚焦， false 表示失焦状态
  boxFocused: boolean;

  // 当前用户按下的键
  keyboard?: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
};
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type ValueBoxProps<T extends any> = CommonProps &
  ValueInputProps &
  FormatValueProps &
  PlaceholderFeatureProps &
  PrefixSuffixFeatureProps & {
    value?: T;
    autoSelect?: boolean;
    prefixIconForClean?: boolean;
    suffixIconForCopy?: boolean;
  };
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type ValueBoxFeature = PlaceholderFeature &
  PrefixSuffixFeature &
  ValueInputFeature & {
    //
    // 数值处理函数
    //
    /**
     * 当输入框初值改变时，需要主动调用这个函数,
     * 本函数会更新 `state.boxVal`
     */
    doUpdateValue: (val: any) => void;
    /**
     * 当用户通过界面输入了内容，需要通过这个函数更新输入框
     * 通常，本函数是做两件事:
     * 1. 修改自身的内部值（通过 doUpdateValue）
     * 2. 通知外部改动
     * 你可以通过 `ValueBoxOptions.valueChangeMode` 改变这个默认行为
     */
    doChangeValue: (val: string) => void;

    /**
     * 本函数会根据 `state.boxVal` 修改 `state.boxText`。
     * `doUpdateValue` 也会在内部调用这个函数
     */
    doUpdateText: () => void;

    //
    // 界面绑定函数
    //
    OnClickPrefixIcon: () => void;
    OnClickSuffixIcon: () => void;
    OnHoverPrefixIcon: (hovered: boolean) => void;
    OnHoverSuffixIcon: (hovered: boolean) => void;
  };
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type ValueBoxOptions = {
  emit: ValueBoxEmits;
  // /**
  //  * 当 doChangeValue 时的行为:
  //  * - `notify`: 通知外部改动
  //  * - `inner` : 修改自身的内部值（通过 doUpdateValue）
  //  * -`both` : 以上两者都做
  //  *
  //  * @default `both`
  //  */
  // valueChangeMode?: 'both' | 'notify' | 'inner';

  /**
   * 如果 suffixIconForCopy, 那么复制之后需要自动闪烁一下 box。
   * 通常这个函数返回的是顶层元素。
   *
   * 如果绘制提示框，也会用这个元素的盒子模型作为弹出提示框的参考位置
   */
  getBoxElement: () => HTMLElement | undefined;

  COM_TYPE: string;
};
/*-----------------------------------------------------

                Use Feature
                
-----------------------------------------------------*/
export function useValueBox<T extends any>(
  state: ValueBoxState<T>,
  props: ValueBoxProps<T>,
  options: ValueBoxOptions
): ValueBoxFeature {
  let { emit, getBoxElement, COM_TYPE } = options;

  let boxProps = _.cloneDeep(props);
  if (_.isUndefined(boxProps.value)) {
    boxProps.value = tiGetDefaultComPropValue(COM_TYPE, 'value');
  }
  //
  // 准备处理值的方法
  let { dict, tidyValue, translateValue } = useValueInput(boxProps);

  // 启用 format 特性
  let formatValue = useFormatValue(boxProps);

  // 准备前后缀框
  if (boxProps.prefixIconForClean) {
    boxProps.prefixIcon = boxProps.prefixIcon || 'zmdi-close';
    boxProps.prefixIconClickable = true;
  }
  if (boxProps.suffixIconForCopy) {
    boxProps.suffixIcon = boxProps.suffixIcon || 'zmdi-copy';
    boxProps.suffixIconClickable = true;
  }
  let _box = usePrefixSuffix(state, boxProps, emit);

  //
  // 方法: 更新内部值
  //
  async function doUpdateValue(input: any) {
    state.boxValue = input;
    await doUpdateText();
  }
  //
  // 方法: 更新显示文本
  //
  async function doUpdateText() {
   // console.log('doUpdateText');
    let focused = state.boxFocused;
    let val = state.boxValue;
    // // 如果聚焦，则仅仅显示原始值，否则，看看是否需要格式化
    if (focused) {
      state.boxInputing = Str.anyToStr(val);
    }
    // // 看看是否需要格式化
    else {
      let text = await translateValue(val);
      state.boxInputing = formatValue(text);
    }
  }
  //
  // 方法: 值发生了改变
  //
  async function doChangeValue(val: string) {
    let v = await tidyValue(val);
    emit('change', v);
  }
  //
  // 方法： 点击前缀按钮
  //
  async function OnClickPrefixIcon() {
    //console.log('OnClickPrefixIcon');
    if (props.prefixIconForClean) {
      await doChangeValue('');
    }
    // 默认行为
    else {
      _box.Prefix.OnClickIcon();
    }
  }

  //
  // 方法： 点击后缀按钮
  //
  function OnClickSuffixIcon() {
    //console.log('OnClickSuffixIcon');
    if (props.suffixIconForCopy) {
      Be.Clipboard.write(state.boxValue);
      Be.BlinkIt(getBoxElement());
    }
    // 默认行为
    else {
      _box.Suffix.OnClickIcon();
    }
  }

  //
  // 初始化值
  //
  state.boxValue = props.value;

  //
  // 输出特性
  return {
    dict,
    tidyValue,
    translateValue,
    ..._box,
    ...usePlaceholder(props),
    doUpdateValue,
    doChangeValue,
    doUpdateText,
    OnClickPrefixIcon,
    OnClickSuffixIcon,
    OnHoverPrefixIcon(hovered: boolean) {
      state.prefixIconHovered = hovered;
    },
    OnHoverSuffixIcon(hovered: boolean) {
      state.suffixIconHovered = hovered;
    },
  };
}
