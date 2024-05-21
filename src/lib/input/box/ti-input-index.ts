import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiInput from './TiInput.vue';
import example from './example';

const en_us = {
  'com-name': 'InputBox',
};
const zh_cn = {
  'com-name': '输入框',
  'example-options': '带选项',
  'example-formated': '格式显示值',
  'example-query': '动态查询',
};

const COM_TYPE = COM_TYPES.Input;

const TiInputInfo: TiComInfo = {
  icon: 'fas-i-cursor',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInput,
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '300px',
    paddingBottom: '30%',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInput);
  },
  defaultProps: 'simple',
  exampleProps: [
    example.simple,
    example.formated,
    example.options,
    example.query,
  ],
};

export { TiInput, TiInputInfo };
