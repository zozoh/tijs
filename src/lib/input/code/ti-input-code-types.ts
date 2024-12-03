import { InputBoxProps } from '../../';
import { AnyOptionItem, AspectSize, Vars } from '../../../_type';

export type InputCodeProps = InputBoxProps & {
  codeWidth?: string | number;
  gap?: AspectSize;
  getDescription?: string | ((item: AnyOptionItem) => string);
  /**
   * 如果开启这个选项，将会用隐藏 .part-desc
   */
  hideDescription?: boolean;

};
