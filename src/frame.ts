import { messageAction, XMessage } from './messages';
import { setElementTheme } from './application/view';
import './frame.css';

interface ExtendedWindow extends Window { 
    renderTemplate: (alias: string, data: object) => string 
}

declare var window: ExtendedWindow;

function ready() {
    window.postMessage('load', '*');
}

function sendMessage(msg: XMessage) {
    window.postMessage(msg, '*');
} 

function receiveMessage({ data }: MessageEvent<XMessage>) {
    if (data.type === 'message@UPDATE') {
        document.body.innerHTML = window.renderTemplate(data.alias, data.data);
    } else if (data.type === 'message@SET_THEME') {
        setElementTheme(document.body, data.theme);
    }
}

function onDocumentClick(e: MouseEvent) {
    if (e.target instanceof Element) {
        let target: Element = e.target;
        
        // Не очень надежно, но если не профукать "?" и `target as Element` то норм
        while(target && !(target as HTMLElement).dataset?.action) {
            const currentTarget = target as Element
            target = currentTarget.parentElement;
        }

        if (target instanceof HTMLElement) {
            const { action, params } = target.dataset;
            sendMessage(messageAction(action, params));
        }
    }
}

document.addEventListener('DOMContentLoaded', ready);
document.body.addEventListener('click', onDocumentClick);
window.addEventListener('message', receiveMessage);
