import { ComPropExample } from '../../../../_type';
import { InputBox2Props } from '../ti-input-box2-types';

export default {
  name: 'formated',
  text: 'i18n:ti-input-example-formated',
  comConf: {
    //className: "",
    format: '【${val}】',
    value: 'HELLO',
    valueCase: 'upper',
    trimed: true,
    placeholder: 'Choose one options',
    prefixIconForClean: true,
    suffixIconForCopy: true,
  } as InputBox2Props,
} as ComPropExample;