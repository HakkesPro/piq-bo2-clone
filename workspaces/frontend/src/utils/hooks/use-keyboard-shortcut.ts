import {
  useEffect,
  useCallback,
  useReducer,
} from 'react';

function disabledEventPropagation(e: Event) {
  if (e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }
}

const blacklistedTargets = ['INPUT', 'TEXTAREA'];

const keysReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'set-key-down':
      return { ...state, [action.key]: true };
    case 'set-key-up':
      return { ...state, [action.key]: false };
    case 'reset-keys':
      return { ...action.data };
    default:
      return state;
  }
};

const useKeyboardShortcut = (shortcutKeys: string[], callback: (keys: string[]) => void, options: Record<string, any>) => {
  if (!Array.isArray(shortcutKeys)) {
    throw new Error('The first parameter to `useKeyboardShortcut` must be an ordered array of `KeyboardEvent.key` strings.');
  }

  if (!shortcutKeys.length) {
    throw new Error('The first parameter to `useKeyboardShortcut` must contain atleast one `KeyboardEvent.key` string.');
  }

  if (!callback || typeof callback !== 'function') {
    throw new Error(
      'The second parameter to `useKeyboardShortcut` must be a function that will be envoked when the keys are pressed.',
    );
  }

  const { overrideSystem } = options || {};
  const initalKeyMapping = shortcutKeys.reduce((currentKeys: Record<string, any>, key: string) => {
    currentKeys[key.toLowerCase()] = false;
    return currentKeys;
  }, {});

  const [keys, setKeys] = useReducer(keysReducer, initalKeyMapping);

  const keydownListener = useCallback(
    (assignedKey) => (keydownEvent: any) => {
      const loweredKey = assignedKey.toLowerCase();

      if (keydownEvent.repeat) return;
      if (blacklistedTargets.includes(keydownEvent.target.tagName)) return;
      if (loweredKey !== keydownEvent.key.toLowerCase()) return;
      if (keys[loweredKey] === undefined) return;

      if (overrideSystem) {
        keydownEvent.preventDefault();
        disabledEventPropagation(keydownEvent);
      }

      setKeys({ type: 'set-key-down', key: loweredKey });
      return false;
    },
    [keys, overrideSystem],
  );

  const keyupListener = useCallback(
    (assignedKey) => (keyupEvent: any) => {
      const raisedKey = assignedKey.toLowerCase();

      if (blacklistedTargets.includes(keyupEvent.target.tagName)) return;
      if (keyupEvent.key.toLowerCase() !== raisedKey) return;
      if (keys[raisedKey] === undefined) return;

      if (overrideSystem) {
        keyupEvent.preventDefault();
        disabledEventPropagation(keyupEvent);
      }

      setKeys({ type: 'set-key-up', key: raisedKey });
      return false;
    },
    [keys, overrideSystem],
  );

  useEffect(() => {
    if (!Object.values(keys).filter((value) => !value).length) {
      callback(keys);
      setKeys({ type: 'reset-keys', data: initalKeyMapping });
    } else {
      setKeys({ type: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, keys]);

  useEffect(() => {
    shortcutKeys.forEach((k) => window.addEventListener('keydown', keydownListener(k)));
    return () => shortcutKeys.forEach((k) => window.removeEventListener('keydown', keydownListener(k)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    shortcutKeys.forEach((k) => window.addEventListener('keyup', keyupListener(k)));
    return () => shortcutKeys.forEach((k) => window.removeEventListener('keyup', keyupListener(k)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useKeyboardShortcut;
