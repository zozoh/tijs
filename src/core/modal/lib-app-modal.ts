import _ from 'lodash';
import { createApp } from 'vue';
import {
  AppModalInitProps,
  AppModalProps,
  Dom,
  EleOptions,
  I18n,
  Icons,
  isIconObj,
} from '..';
import { IconInput, LogicType, PopItemProps } from '../../lib';
import TiAppModal from './TiAppModal.vue';

export async function openAppModal(props: AppModalProps): Promise<any> {
  // 创建对应的 mask 容器元素
  let wrapperElment = {
    tagName: 'div',
    className: 'app-modal-wrapper',
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
    },
    $p: document.body,
  } as EleOptions;
  let $gasket = Dom.createElement(wrapperElment);

  return new Promise<any>((_resolve, _reject) => {
    function returnValue(re?: any) {
      if (_.isUndefined(re)) {
        _resolve(undefined);
      } else {
        let reo = _.cloneDeep(re);
        _resolve(reo);
      }
    }
    function releaseDom() {
      app.unmount();
      Dom.remove($gasket);
    }

    // 使用 app 映射到元素
    let app = createApp(TiAppModal, {
      ...props,
      returnValue,
      releaseDom,
    } as AppModalInitProps);
    app.mount($gasket);

    // 关闭对话框时，也移除创建的元素
    //app.unmount();
  });
}

export type AlertOptions = PopItemProps & {
  icon?: IconInput;
  title?: string;
  type?: LogicType;
  iconOk?: IconInput;
  textOk?: string;
  bodyIcon?: IconInput;
  contentType?: 'text' | 'html';
};

function __get_msg_box_html(
  msg: string,
  bodyIcon: IconInput = 'zmdi-alert-circle-o',
  msgAsHtml: boolean
) {
  // Build html
  let msgWithI18n = I18n.text(msg);
  let msgIcon = isIconObj(bodyIcon) ? bodyIcon : Icons.parseIcon(bodyIcon);

  let html = [`<div class="msg-box"'>`] as string[];
  // 左侧的显示图标
  html.push(`<aside>`);
  // 嵌入图像图标
  if (msgIcon.type == 'image' && msgIcon.src) {
    html.push(`<img src="${msgIcon.src}"/>`);
  }
  // 嵌入字体图标
  else if (msgIcon.type == 'font' && msgIcon.className) {
    html.push(`<i class="${msgIcon.className}"></i>`);
  }
  // 嵌入默认图标
  else {
    html.push(`<i class="zmdi zmdi-info-outline"></i>`);
  }
  html.push(`</aside>`);
  // 右侧显示消息正文
  html.push(`<main>`);
  // 本身就是 html 文本
  if (msgAsHtml) {
    html.push(msgWithI18n);
  }
  // 变成普通文本
  else {
    html.push(`<pre>${Dom.textToHtml(msgWithI18n)}</pre>`);
  }
  html.push('</main></div>');

  return html.join('\n');
}

export async function Alert(msg: string, options: AlertOptions): Promise<void> {
  // Build html
  let html = __get_msg_box_html(
    msg,
    options.bodyIcon,
    'html' == options.contentType
  );
  // Prepare dialog
  let dialog = {
    icon: 'zmdi-notifications',
    title: 'i18n:info',
    type: 'info',
    textOk: 'i18n:ok',
    position: 'center',
    width: '5rem',
    height: '1.9rem',
    comType: 'TiHtmlSnippet',
    comConf: {
      content: html,
    },
    showMask: true,
    clickMaskToClose: false,
  } as AppModalProps;

  return openAppModal(dialog);
}
