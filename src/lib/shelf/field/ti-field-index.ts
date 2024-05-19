import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import TiField from './TiField.vue';

const en_us = {
  'com-name': 'Field',
};
const zh_cn = {
  'com-name': '字段',
  'example-input': '输入',
};

const COM_TYPE = COM_TYPES.Field;

const TiFieldInfo: TiComInfo = {
  icon: 'fas-feather',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-field-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiField,
  asInner: true,
  install: (app: App) => {
    app.component(COM_TYPE, TiField);
  },
  defaultProps: 'simple',
  exampleModel: {
    change: {
      key: 'data.${name}',
      val: '=value',
    },
  },
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        title: 'Name',
        name: 'name',
        data: {
          name: 'Peter',
          age: 45,
        },
      },
    },
    {
      name: 'input',
      text: 'i18n:ti-field-example-input',
      comConf: {
        title: 'Name',
        name: 'name',
        data: {
          name: 'Peter',
          age: 45,
        },
        comType: 'TiInput',
      },
    },
  ],
};

export { TiField, TiFieldInfo };
