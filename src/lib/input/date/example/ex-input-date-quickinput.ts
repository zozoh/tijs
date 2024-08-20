import { ComPropExample } from '../../../../_type';
import { InputDatetimeProps } from '../../datetime/ti-input-datetime-types';

export default {
  name: 'quickinput',
  text: 'i18n:ti-input-date-example-quickinput',
  comConf: {
    value: '2024-05-25',
    format: 'yyyy年M月d日',
  } as InputDatetimeProps,
} as ComPropExample;
