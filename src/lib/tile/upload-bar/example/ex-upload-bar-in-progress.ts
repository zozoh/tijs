import { ComPropExample } from '../../../../_type';
import { UploadBarProps } from '../ti-upload-bar-types';

export default {
  name: 'in-progress',
  text: 'i18n:ti-thumb-example-in-progress',
  comConf: {
    icon: { value: 'far-file-zipper' },
    text: 'Hello My Document',
    progress: {
      value: 0.64,
    },
    actions: {
      className: 'top-as-button',
      items: [
        {
          text: 'i18n:upload',
          icon: 'fas-upload',
        },
      ],
    },
  } as UploadBarProps,
} as ComPropExample;
