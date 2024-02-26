import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../';
import TiSidebar from './TiSidebar.vue';
import { simple } from './example';
import i18n from './i18n';

const COM_TYPE = 'TiSidebar';

const TiSidebarInfo: TiComInfo = {
  icon: 'fas-hill-rockslide',
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-sidebar-com-name',
  i18n,
  com: TiSidebar,
  events: ['fire'],
  install: (app: App) => {
    app.component(COM_TYPE, TiSidebar);
  },
  defaultProps: 'simple',
  exampleProps: [simple],
};

export { TiSidebar, TiSidebarInfo };
