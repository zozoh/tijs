import JSON5 from 'json5';
import _ from 'lodash';
import {
  AsyncFuncA1,
  DictName,
  DictSetup,
  Dicts,
  FuncA1,
  Str,
  StrCaseMode,
  TiDict,
  Vars,
  isDictSetup,
} from '../../core';
import { wrapPromiseFunc } from '../../core/util/util-lang.ts';
/*-------------------------------------------------------

                        Types

-------------------------------------------------------*/
type ValueProcessorSet = {
  head: ((val: any) => Promise<any>)[];
  main: ((val: any) => Promise<any>)[];
  dict: ((val: any) => Promise<any>)[];
  tail: ((val: any) => Promise<any>)[];
};
/*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
export type ValueInputProps = {
  /**
   * 输入值后是否需要强制修改文本形式
   */
  valueCase?: StrCaseMode;

  /**
   * 输入值后是否需要去掉前后空白
   */
  trimed?: boolean;

  /**
   * 自定义任何其他值处理器，在内置处理器后执行
   */
  beforeValueProcessors?: FuncA1<any, string> | FuncA1<any, string>[];

  /**
   * 自定义任何其他值处理器，在内置处理器后执行
   */
  afterValueProcessors?: FuncA1<any, string> | FuncA1<any, string>[];

  /**
   * 可以获取一个`IDict`实例
   */
  options?: string | DictName | DictSetup;

  /**
   * 动态字典需要这个属性作为变量上下文
   */
  dictVars?: Vars;

  /**
   * 值必须在字典中
   */
  mustInOptions?: boolean;
};

/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type ValueInputTidyMode = keyof ValueProcessorSet;
export type ValueInputFeature = {
  dict?: Dicts.TiDict;
  tidyValue: (val: any, mode?: ValueInputTidyMode[]) => Promise<any>;
  translateValue: (val: any) => Promise<string>;
};
/*-------------------------------------------------------

                     Methods

-------------------------------------------------------*/
/**
 * 建立选项字典
 */
function __build_dict(props: ValueInputProps): TiDict | undefined {
  let { options, dictVars = {} } = props;
  if (options) {
    // 直接就是选项
    if (isDictSetup(options)) {
      let dictOptions = Dicts.makeDictOptions(options);
      return Dicts.createDict(dictOptions);
    }

    // 分析字典名称
    let dictName: DictName;
    if (_.isString(options)) {
      let referName = Dicts.dictReferName(options);
      dictName = Dicts.explainDictName(referName);
    } else {
      dictName = options;
    }

    // 获取字典: 动态
    let { name, dynamic, dictKey } = dictName;
    if (dynamic) {
      if (!dictKey) {
        throw new Error(
          `DynamicDict: "${JSON5.stringify(dictName)}" without {dictKey}`
        );
      }
      let key = _.get(dictVars, dictKey);
      if (!key) {
        throw new Error(
          `DynamicDict: "${JSON5.stringify(
            dictName
          )}" Fail to get key from dictVars: ${JSON5.stringify(dictVars)}`
        );
      }
      return Dicts.checkDynamicDict(name, key, dictVars);
    }

    // 获取字典: 静态
    return Dicts.checkDict(name);
  }
}
/**
 * 收集值处理器
 */
function __build_process_pips(props: ValueInputProps, dict?: TiDict) {
  let processors: ValueProcessorSet = {
    head: [],
    main: [],
    dict: [],
    tail: [],
  };
  //........................................
  // 自定义：前置
  let list = wrapPromiseFunc<FuncA1<any, string>, AsyncFuncA1<any, string>>(
    props.beforeValueProcessors
  );
  processors.head.push(...list);
  //........................................
  // 内部处理器：前置
  if (props.trimed) {
    processors.main.push(async (v) => _.trim(v));
  }
  if (props.valueCase) {
    let toCase = Str.getCaseFunc(props.valueCase);
    processors.main.push(async (v) => toCase(v));
  }
  //........................................
  // 字典值处理器
  if (props.mustInOptions && dict) {
    processors.dict.push(async (v) => {
      let it = await dict.getStdItem(v);
      return it?.value;
    });
  }
  //........................................
  // 自定义：后置
  list = wrapPromiseFunc<FuncA1<any, string>, AsyncFuncA1<any, string>>(
    props.afterValueProcessors
  );
  processors.tail.push(...list);

  //
  // 搞定返回
  return processors;
}
/*-----------------------------------------------------

                Use Feature
                
-----------------------------------------------------*/
/**
 * 建议在 Computed 函数里使用，以便获得最大程度的响应性
 */
export function useValueInput(props: ValueInputProps): ValueInputFeature {
  //
  // 准备选项过滤器
  const dict = __build_dict(props);
  //
  // 准备处理器
  const processors = __build_process_pips(props, dict);
  //
  // 导出
  return {
    dict,
    /**
     * 【异步】对输入的值进行处理
     */
    tidyValue: async function (
      val: any,
      mode?: ValueInputTidyMode[]
    ): Promise<any> {
      let mark = {
        head: false,
        main: false,
        dict: false,
        tail: false,
      } as Record<ValueInputTidyMode, boolean>;

      // 全都需要
      if (!mode || _.isEmpty(mode)) {
        _.forEach(mark, (_v, k) => (mark[k as ValueInputTidyMode] = true));
      }
      // 逐个解开
      else {
        _.forEach(mode, (k) => (mark[k] = true));
      }

      return new Promise<any>(async (resolve, reject) => {
        let is_error = false;
        try {
          if (mark.head) {
            for (let processor of processors.head) {
              val = await processor(val);
            }
          }
          if (mark.main) {
            for (let processor of processors.main) {
              val = await processor(val);
            }
          }
          if (mark.dict) {
            for (let processor of processors.dict) {
              val = await processor(val);
            }
          }
          if (mark.tail) {
            for (let processor of processors.tail) {
              val = await processor(val);
            }
          }
        } catch (err) {
          is_error = true;
          if (!(err instanceof Error)) {
            err = new Error(Str.anyToStr(err));
          }
          console.error(err);
          reject(err);
        } finally {
          if (!is_error) {
            resolve(val);
          }
        }
      });
    },
    translateValue: async function (val: any): Promise<string> {
      return new Promise<any>(async (resolve, _reject) => {
        if (dict) {
          let it = await dict.getItem(val);
          if (!it) {
            if (props.mustInOptions) {
              resolve(undefined);
            } else {
              resolve(val);
            }
          } else {
            resolve(it.text);
          }
        }
        // 直接返回
        else {
          resolve(val);
        }
      });
    },
  };
}
