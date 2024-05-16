import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core';
import { COM_TYPES } from '../../lib-com-types';
import TiGridFields from './TiGridFields.vue';
import example from './example';

const en_us = {
  'com-name': 'GridFields',
};
const zh_cn = {
  'com-name': '栅格字段组',
};

const COM_TYPE = COM_TYPES.GridFields;

const TiGridFieldsInfo: TiComInfo = {
  tags: ['ing'],
  icon: 'zmdi-view-list',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-grid-fields-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiGridFields,
  install: (app: App) => {
    app.component(COM_TYPE, TiGridFields);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-grid-fields-types';
export { TiGridFields, TiGridFieldsInfo };