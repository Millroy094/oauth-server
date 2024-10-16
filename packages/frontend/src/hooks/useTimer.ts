import { useCallback, useEffect, useState } from 'react';

function useTimer() {
  const [timer, setTimer] = useState(60);
  const timeOutCallback = useCallback(
    () => setTimer((currentTime) => currentTime - 1),
    []
  );
  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
  }, [timer, timeOutCallback]);

  const resetTimer = () => {
    if (!timer) {
      setTimer(60);
    }
  };

  return { timer, resetTimer };
}

export default useTimer;
