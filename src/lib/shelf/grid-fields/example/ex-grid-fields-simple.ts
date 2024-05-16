import { ComPropExample } from '../../../../core';
import { GridFieldsProps } from '../ti-grid-fields-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    data: {
      id: 'Um5Cub2yX',
      name: 'Mahanta Lloyd',
      title: 'pamperedly schmitz enne',
      brief: 'Earthy numerably abulia globus rosinweed. ',
      client: '192.168.12.211',
      age: 32,
      role: 'staff',
      address: 'stuck-uppishness pteromalid',
    },
    defaultComType: 'TiInput',
    layoutHint: '[[3,800],[2,400],1]',
    title: '<b style="color:red">Hello</b> world',
    titleType: 'html',
    bodyPartGap:'b',
    bodyPartFontSize:'m',
    fields: [
      {
        title: 'Id',
        name: 'id',
        className: 'is-warn',
        style: {
          gridColumnEnd: 'span 2',
        },
        comType: 'TiLabel',
      },
      {
        title: 'Age',
        name: 'age',
        type: 'Integer',
      },
      {
        title: 'Name',
        name: 'name',
      },
      {
        title: 'Title',
        name: 'title',
      },
      {
        title: 'Brief',
        name: 'brief',
      },
      {
        title: 'Client',
        name: 'client',
      },
      {
        title: 'Role',
        name: 'role',
      },
    ],
  } as GridFieldsProps,
} as ComPropExample;
