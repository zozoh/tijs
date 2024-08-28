import _ from 'lodash';
import { computed, ComputedRef } from 'vue';
import {
  FormatValueProps,
  PlaceholderProps,
  PrefixSuffixEvents,
  PrefixSuffixFeature,
  PrefixSuffixProps,
  PrefixSuffixState,
  ReadonlyProps,
  useFormatValue,
  usePrefixSuffix,
  useValueInput,
  ValueInputFeature,
  ValueInputProps,
} from '..';
import { CommonProps, IconInput, Vars } from '../../_type';
import { Be, Dicts, Str, tiGetDefaultComPropValue, Tmpl } from '../../core';
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

  // 如果有字典，那么对应标准项目的 icon/tip 可以设置到这里
  // - 要求，设置了字典，且 mustInOptions
  boxIcon?: IconInput;
  boxTip?: string;

  // 存储翻译出来的对象
  boxItem?: any;

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
  ReadonlyProps &
  PlaceholderProps &
  PrefixSuffixProps & {
    value?: T;
    autoSelect?: boolean;
    // 前缀按钮用来删除
    prefixIconForClean?: boolean;
    // 后缀按钮用来复制
    suffixIconForCopy?: boolean;
    /**
     * 如果开启这个开关, 只要定义了字典，且 mustInOptions
     * 那么将自动根据选项设置前缀图标
     */
    autoPrefixIcon?: boolean;

    /**
     * 如果值是某个选项，默认的会在输入框显示选项的文字而不是值。
     * 开启这个选项，则在输入框直接显示值而不是翻译后的文字
     */
    useRawValue?: boolean;

    /**
     * 默认的，当输入框聚焦，且输入框不是只读还且是可输入的状态
     * 输入框会自动将内容变成原始值。因为这个框本来就代表着原始值。
     *
     * 某些时候，你并不想要这种行为，则可以打开这个选项。
     * 这意味着，即使聚焦的时候，可编辑的输入框也会显示翻译后的文本。
     *
     * 实用场景譬如： TiInputCode，处于 `[text][tip]` 模式下，我们总想
     * 让输入框显示有意义的便于人类阅读的文字，因为我们可能用 text 表示
     * 一个记录的唯一值，而真正存储是这个记录的UUID主键。我们当然不想
     * 让用户聚焦输入框就显示可怕的 UUID，这会让很多初级用户产生不舒适甚至恐慌
     */
    useTextWhenFocus?: boolean;

    // 输入框，是否允许用户输入
    canInput?: boolean;

    /**
     * 是否要在选项的首部，增加一个【清除】 的选项
     */
    showCleanOption?: boolean;

    // 动态渲染的上下文
    boxVars?: Vars;

    /**
     * 有时候，我们不想让用户输入的字符串简单的传递给 dict.query 去查询。
     * 我们需要给 hint 字符串编制更多的信息。
     *
     * 譬如一个选择框，输入省份的 code 进行查询，但是我们还想加入国家这个约束条件。
     * 我们可以通过 boxVars 接受国家的代码，譬如 `{country:'CN'}`，
     * 当我们输入 G 的时候，我们希望传递给后端 `G:CN` 这样的字符串。
     *
     * 因此我们就要用到这个配置，将其设置为 '${hint}:${country}' 就能在每次查询
     * 的时候根据这个字符串模板进行渲染。
     * 它的上下文，永远是 `{...boxVars, hint:'你输入的内容'}`。
     *
     * > ！因此不要为 boxVars 设置 'hint' 这个名称的变量，因为会被你输入的内容重载掉。
     *
     * 如果你指定的是一个自定义函数，那你就能做的更加细腻
     */
    renderHint?: string | ((vars: Vars) => string);
  };
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type ValueBoxFeature = PrefixSuffixFeature &
  ValueInputFeature & {
    //
    // 数值处理函数
    //
    renderHint: ((vars: Vars) => string) | undefined;
    prepareHintVars: (hint: string) => Vars;
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
  //console.log('useValueBox');
  let { emit, getBoxElement, COM_TYPE } = options;
  //................................................
  const RenderHint = computed(() => {
    if (props.renderHint) {
      if (_.isString(props.renderHint)) {
        let t = Tmpl.parse(props.renderHint);
        return (vars: Vars) => {
          return t.render(vars);
        };
      }
      return props.renderHint;
    }
  });
  //................................................
  function prepareHintVars(hint: string): Vars {
    let re = _.cloneDeep(props.boxVars ?? {});
    re.hint = hint;
    return re;
  }
  //................................................
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
  if (boxProps.autoPrefixIcon && state.boxIcon) {
    boxProps.prefixIcon = state.boxIcon ?? props.prefixIcon;
  }
  if (boxProps.prefixIconForClean && !props.readonly) {
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
    let focused = state.boxFocused;
    let val = state.boxValue;
    //console.log('state.boxValue', val);

    // 如果聚焦，则仅仅显示原始值，否则，看看是否需要格式化
    // 除非调用者明确禁止这种行为
    if (
      focused &&
      !props.readonly &&
      props.canInput &&
      !props.useTextWhenFocus
    ) {
      state.boxInputing = Str.anyToStr(val);
    }
    // 看看是否需要格式化
    else {
      let textOrItem: string | Dicts.DictItem<any>;
      try {
        // 再次整理 hint
        if (RenderHint.value) {
          let v_in_str = `${val}`;
          let hvars = prepareHintVars(v_in_str);
          val = (RenderHint.value(hvars) ?? val) as T;
          //console.log(`await translateValue(${val});`);
        }
        textOrItem = await translateValue(val);
        // if (RenderHint.value) {
        //   console.log(textOrItem);
        // }
      } catch (e) {
        console.trace(e);
        console.warn(`Fail to translateValue(${Str.anyToStr(val)})`);
        textOrItem = Str.anyToStr(val);
      }
      let text: string;
      let item: Vars | undefined = undefined;
      if (textOrItem instanceof Dicts.DictItem) {
        // 强制指定采用选项的值来显示
        if (props.useRawValue) {
          text = textOrItem.value;
        }
        // 显示选项文字
        else {
          text = textOrItem.text || textOrItem.value;
        }
        state.boxIcon = textOrItem.icon;
        state.boxTip = textOrItem.tip;
        state.boxItem = textOrItem.toOptionItem();
        item = { ...textOrItem.toOptionItem() };
      } else {
        text = textOrItem;
        state.boxIcon = undefined;
        state.boxTip = undefined;
        state.boxItem = undefined;
      }

      // 未翻译成功
      if (!text && !props.mustInOptions) {
        text = Str.anyToStr(val);
      }

      try {
        //console.log(`state.boxInputing = formatValue:`, text, item, formatValue(text, item));
        state.boxInputing = formatValue(text, item);
        // if (state.boxInputing.length == 0) {
        //   console.trace(`doUpdateText=>state.boxInputing ${props.value}`);
        // }
      } catch (e) {
        console.warn(`Fail to formatValue`, { text, item, val });
        textOrItem = Str.anyToStr(val);
      }
    }
  }

  // 方法: 值发生了改变
  //
  async function doChangeValue(val: string) {
    if (props.readonly) {
      return;
    }
    let v = await tidyValue(val);
    // console.log("doChangeValue", val, v)
    emit('change', v);
  }
  //
  // 方法： 点击前缀按钮
  //
  async function OnClickPrefixIcon() {
    if (props.readonly) {
      return;
    }
    //console.log('OnClickPrefixIcon');
    if (props.prefixIconForClean) {
      await doChangeValue('');
    }
    // 默认行为
    else {
      emit('click-prefix-icon');
    }
  }

  //
  // 方法： 点击后缀按钮
  //
  function OnClickSuffixIcon() {
    if (props.readonly) {
      return;
    }
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

    renderHint: RenderHint.value,
    prepareHintVars,

    doUpdateValue,
    doChangeValue,
    doUpdateText,
    OnClickPrefixIcon,
    OnClickSuffixIcon,
    OnHoverPrefixIcon(hovered: boolean) {
      if (!props.readonly && _box.Prefix.canHoverIcon) {
        state.prefixIconHovered = hovered;
      }
    },
    OnHoverSuffixIcon(hovered: boolean) {
      if (!props.readonly && _box.Suffix.canHoverIcon) {
        state.suffixIconHovered = hovered;
      }
    },
  };
}
