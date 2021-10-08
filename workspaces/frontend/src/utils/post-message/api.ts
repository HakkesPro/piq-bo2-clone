import type { NotifyLegacyBoSetMid, SetNewBoPath } from 'types/post-message-types';
import { eventTypes } from 'types/post-message-types';
import { getLegacyBaseUrl } from 'utils/helpers';

export const registerListeners = () => {
  window.addEventListener('message', (e) => {
    switch (e.data.eventType) {
      case eventTypes.OPEN_SUPPORT_WIDGET:
        // eslint-disable-next-line no-console
        window.GrooveWidget.OPEN_SUPPORT_WIDGET(e.data.payload);
        break;
      default:
        break;
    }
  });
};

const getLegacyBoWindow = (): HTMLIFrameElement | null => {
  const iframe: HTMLIFrameElement | null = document.querySelector('#legacy-backoffice-wrapper');
  if (iframe && iframe.contentWindow) {
    return iframe;
  }
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log('No window found for legacy backoffice');
  }
  return null;
};

const sendPm = <Payload>(
  payload: Payload,
  receivingWindow: HTMLIFrameElement | null = getLegacyBoWindow(),
  receivingOrigin: string | undefined = getLegacyBaseUrl(),
) => {
  if (receivingWindow && receivingWindow.contentWindow && receivingOrigin) {
    receivingWindow.contentWindow.postMessage(payload, receivingOrigin);
  } else if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(
      `Missing postMessage receiving window or receiving origin.
      Receving Window: ${receivingWindow}, ReceivingOrigin: ${receivingOrigin}`,
    );
  }
};

export const notifySelectNewMerchant = (mId: number) => {
  const payload: NotifyLegacyBoSetMid = {
    eventType: eventTypes.PIQ_BO_SET_MID,
    mId,
  };

  sendPm<NotifyLegacyBoSetMid>(payload);
};

export const setNewBoPath = (path: string) => {
  const payload: SetNewBoPath = {
    eventType: eventTypes.PIQ_BO_SET_PATH,
    path,
  };
  sendPm<SetNewBoPath>(payload);
};
