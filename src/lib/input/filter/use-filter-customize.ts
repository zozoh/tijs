import _ from 'lodash';
import { openAppModal } from '../../';
import { StrOptionItem } from '../../../core';
import { FilterProps } from './ti-filter-types';
import { FilterEmitter } from './use-filter';
import { joinFieldsTitle, makeFieldsMap } from './use-filter-fields';

export async function useFilterCustomization(
  props: FilterProps,
  emit: FilterEmitter
) {
  // 准备字段选项
  let fieldMap = makeFieldsMap(props.fields);
  let options = [] as StrOptionItem[];
  for (let [uniqKey, fields] of fieldMap) {
    options.push({
      text: joinFieldsTitle(fields),
      value: uniqKey,
    });
  }

  // 挑选
  let re = await openAppModal({
    icon: 'zmdi-toys',
    title: 'i18n:ti-filter-customize',
    type: 'info',
    position: 'bottom',
    width: '640px',
    height: '80%',
    clickMaskToClose: true,
    result: props.majorFields ?? [],
    comType: 'TiTransfer',
    comConf: {
      options,
    },
  });

  // 用户取消
  if (!re) {
    return;
  }

  // 改动
  if (!_.isEqual(re, props.majorFields)) {
    emit('change-major', re);
  }
}
