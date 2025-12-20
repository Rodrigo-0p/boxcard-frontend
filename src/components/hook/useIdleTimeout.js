import * as React from 'react';

export default function useIdleTimeout(onIdle, timeout = 30 * 60 * 1000) {
  const timer = React.useRef();

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onIdle();
    }, timeout);
  };

  React.useEffect(() => {
    const events = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart'];
    events.forEach(ev => document.addEventListener(ev, resetTimer));
    resetTimer(); 

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach(ev => document.removeEventListener(ev, resetTimer));
    };
  }, [timeout, onIdle]);
  // No retorna nada
}