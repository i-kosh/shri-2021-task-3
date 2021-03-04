import { XMessage } from '../messages';
import { SlideTheme } from './types';

export type ExtendedIframeElement = HTMLIFrameElement & {
  _isLoaded: boolean
}

export const setScale = (el: HTMLDivElement, value: number) => {
    el.style.transform = `scaleX(${value.toFixed(5)})`;
}

export const sendMessage = (iframe: ExtendedIframeElement, msg: XMessage) => {
  if (iframe && iframe.contentWindow) {
    if (iframe._isLoaded) {
      iframe.contentWindow.postMessage(msg, "*");
    } else {
      iframe.addEventListener(
        "load",
        () => {
          iframe.contentWindow.postMessage(msg, "*");
          iframe._isLoaded = true
        },
        {
          once: true,
        }
      );
    }
  }
};

export const initIframe = (parent: HTMLDivElement, onLoad: (iframe: ExtendedIframeElement) => void) => {
    var iframe = document.createElement('iframe') as ExtendedIframeElement;
    iframe._isLoaded = false

    iframe.classList.add('frame');
    iframe.src = 'frame.html';
    iframe.sandbox.add('allow-scripts');
    iframe.sandbox.add('allow-same-origin');

    iframe.addEventListener('load', () => {
      onLoad(iframe)
      iframe._isLoaded = true
    });
    parent.appendChild(iframe);

    return iframe;
};

export const initProgress = (parent: HTMLDivElement) => {
    const container = document.createElement('div');
    container.classList.add('slide-progress');
    const progress = document.createElement('div');
    progress.classList.add('slide-progress-value');
    container.appendChild(progress);

    parent.appendChild(container);

    return progress;
}

export const setElementTheme = (elem: HTMLElement, theme: SlideTheme) => {
  const classList = elem.classList;
  classList.forEach((token) => {
    if (/theme_\S+/.test(token)) {
      classList.remove(token);
    }
  });
  elem.classList.add(`theme_${theme}`);
};
