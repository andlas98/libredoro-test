/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Modal from './components/modal';
import './App.css';
import PlayIcon from './components/icons/playIcon';
import PauseIcon from './components/icons/pauseIcon';
import SkipIcon from './components/icons/skipIcon';
import RestartIcon from './components/icons/restartIcon';
import StopIcon from './components/icons/stopIcon';

function Hello() {
  interface Timer {
    name: string;
    currentTime: string;
    setTime: string;
    status: boolean | string; // true = active, "paused" = timer is paused, false = inactive (not playing)
  }

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timerControlBtnsAreVisible, setTimerControlBtnsAreVisible] =
    useState(false);

  // setTime = the time the user sets on the timer
  // currentTime = the time currently displaying on its corresponding timer, regardless of whether a timer is paused, active, or in another state
  const [seshATimer, setSeshATimer] = useState<Timer>({
    name: 'Timer A',
    currentTime: '00:00',
    setTime: '00:00',
    status: false,
  });

  const [seshBTimer, setSeshBTimer] = useState<Timer>({
    name: 'Timer B',
    currentTime: '00:00',
    setTime: '00:00',
    status: false,
  });

  let timerStatusMessage = '';

  // const { timerIsPaused, setTimerIsPaused } = useState(false);

  // Helper functions for Timer interface
  function updateTimerName(timer: Timer, newName: string): Timer {
    return { ...timer, name: newName };
  }

  const updateTimerCurrentTime = React.useCallback(
    (timer: Timer, newCurrentTime: string): Timer => {
      return { ...timer, currentTime: newCurrentTime };
    },
    [],
  );

  function updateTimerSetTime(timer: Timer, newSetTime: string): Timer {
    return { ...timer, setTime: newSetTime };
  }

  function updateTimerStatus(timer: Timer, newStatus: boolean | string): Timer {
    return { ...timer, status: newStatus };
  }

  function setTimeIsInvalid(
    seshAMinutes: String,
    seshASeconds: String,
    seshBMinutes: String,
    seshBSeconds: String,
  ) {
    if (
      seshAMinutes === '00' &&
      seshASeconds === '00' &&
      seshBMinutes === '00' &&
      seshBSeconds === '00'
    ) {
      alert('Please enter a valid time for the timers.');
      return true;
    }
    if (seshAMinutes === '00' && seshASeconds === '00') {
      alert(`Please enter a valid time for ${seshATimer.name}.`);
      return true;
    }
    if (seshBMinutes === '00' && seshBSeconds === '00') {
      alert(`Please enter a valid time for ${seshBTimer.name}.`);
      return true;
    }

    return false;
  }

  useEffect(() => {
    if (seshATimer.currentTime === '00:00' && seshATimer.status === true) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Start Session B when Session A finishes
      setSeshBTimer((prev) => updateTimerStatus(prev, true));
      if (
        seshBTimer.currentTime === '00:00' &&
        seshBTimer.setTime !== '00:00'
      ) {
        setSeshBTimer((prev) =>
          updateTimerCurrentTime(prev, seshBTimer.setTime),
        );
      }
      setSeshATimer((prev) => updateTimerStatus(prev, false));
      return;
    }

    if (seshATimer.status === true && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeshATimer((prev) => {
          const [minutes, seconds] = prev.currentTime.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds - 1;
          const newMinutes = String(
            Math.floor((totalSeconds % 3600) / 60),
          ).padStart(2, '0');
          const newSeconds = String(totalSeconds % 60).padStart(2, '0');
          const newTime = `${newMinutes}:${newSeconds}`;
          return updateTimerCurrentTime(prev, newTime);
        });
      }, 1000);
    }
  }, [seshATimer.status, seshATimer.currentTime, updateTimerCurrentTime]);

  // Handles Session B countdown and transition back to Session A
  useEffect(() => {
    if (seshBTimer.currentTime === '00:00' && seshBTimer.status === true) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Optionally, restart Session A or stop both timers here
      setSeshATimer((prev) => updateTimerStatus(prev, true));
      if (
        seshATimer.currentTime === '00:00' &&
        seshATimer.setTime !== '00:00'
      ) {
        setSeshATimer((prev) =>
          updateTimerCurrentTime(prev, seshATimer.setTime),
        );
      }
      setSeshBTimer((prev) => updateTimerStatus(prev, false));
      return;
    }

    if (seshBTimer.status === true && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeshBTimer((prev) => {
          const [minutes, seconds] = prev.currentTime.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds - 1;
          const newMinutes = String(
            Math.floor((totalSeconds % 3600) / 60),
          ).padStart(2, '0');
          const newSeconds = String(totalSeconds % 60).padStart(2, '0');
          const newTime = `${newMinutes}:${newSeconds}`;
          return updateTimerCurrentTime(prev, newTime);
        });
      }, 1000);
    }
  }, [seshBTimer.status, seshBTimer.currentTime, updateTimerCurrentTime]);

  function pauseTimer() {
    if (seshATimer.status === true || seshBTimer.status === true) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (seshATimer.status === true) {
        setSeshATimer((prev) => updateTimerStatus(prev, 'paused'));
      } else if (seshBTimer.status === true) {
        setSeshBTimer((prev) => updateTimerStatus(prev, 'paused'));
      }
    }
  }

  function stopTimer() {
    // Stop/exit behavior: clear interval and stop both timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSeshATimer((prev) => updateTimerStatus(prev, false));
    setSeshATimer((prev) => updateTimerCurrentTime(prev, seshATimer.setTime));
    setSeshBTimer((prev) => updateTimerStatus(prev, false));
    setSeshBTimer((prev) => updateTimerCurrentTime(prev, seshBTimer.setTime));

    setTimerControlBtnsAreVisible(false);
  }

  function skipTimer() {
    if (seshATimer.status === true || seshBTimer.status === true) {
      if (seshATimer.status === true && seshBTimer.status === false) {
        setSeshBTimer((prev) => updateTimerStatus(prev, true));
        setSeshATimer((prev) =>
          updateTimerCurrentTime(prev, seshATimer.setTime),
        );
        setSeshATimer((prev) => updateTimerStatus(prev, false));
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else if (seshATimer.status === false && seshBTimer.status === true) {
        setSeshATimer((prev) => updateTimerStatus(prev, true));
        setSeshBTimer((prev) =>
          updateTimerCurrentTime(prev, seshBTimer.setTime),
        );
        setSeshBTimer((prev) => updateTimerStatus(prev, false));
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }
  }

  function resumeTimer() {
    if (seshATimer.status === 'paused') {
      setSeshATimer((prev) => updateTimerStatus(prev, true));
    } else if (seshBTimer.status === 'paused') {
      setSeshBTimer((prev) => updateTimerStatus(prev, true));
    }
  }

  function restartTimer() {
    // Modal pops up before this code runs. onConfirm, code runs
    if (seshATimer.status === true && !seshBTimer.status) {
      setSeshATimer((prev) => {
        return updateTimerCurrentTime(prev, seshATimer.setTime);
      });
      timerStatusMessage = `${seshATimer.name} has stopped.`;
    } else if (seshBTimer.status === true && !seshATimer.status) {
      setSeshBTimer((prev) => {
        return updateTimerCurrentTime(prev, seshBTimer.setTime);
      });
      timerStatusMessage = `${seshBTimer.name} has stopped.`;
    }
  }

  function isEitherTimerActive() {
    if (seshATimer.status === true || seshBTimer.status === true) {
      return true;
    }
    return false;
  }

  const [modularModalKey, setModularModalKey] = useState<
    'stop' | 'exit' | 'restart' | 'skip' | null
  >(null);

  // compute modal text values so props receive strings (not functions)
  const modalTitleText: string =
    modularModalKey === 'stop'
      ? 'Would you like to stop the current timer?'
      : modularModalKey === 'restart'
        ? 'Would you like to restart the current timer?'
        : modularModalKey === 'exit'
          ? 'Would you like to exit? Doing so will stop the timer.'
          : modularModalKey === 'skip'
            ? 'Would you like to skip the current session?'
            : '';

  const modalBodyText: string =
    modularModalKey === 'stop'
      ? 'stopTimerAlarmScript.body'
      : modularModalKey === 'exit'
        ? 'exitTimerScript.body'
        : '';

  const modalButton1Text: string =
    modularModalKey === 'stop'
      ? 'Yes'
      : modularModalKey === 'exit'
        ? 'Yes, exit'
        : 'Yes';

  const modularModal = (
    <Modal
      open={modularModalKey !== null}
      onClose={() => setModularModalKey(null)}
      onConfirm={() => {
        if (modularModalKey === 'stop') {
          stopTimer();
        }
        if (modularModalKey === 'restart') {
          restartTimer();
        }
        if (modularModalKey === 'skip') {
          skipTimer();
        }
        setModularModalKey(null);
      }}
      modalTitle={modalTitleText}
      modalBody={modalBodyText}
      button1Text={modalButton1Text}
    />
  );

  const seshATimerHTML = (
    <div id="session-a-timer">
      <p className="text-red-100">{seshATimer.name}</p>
      <h1>{seshATimer.currentTime}</h1>
      <input
        type="number"
        min="0"
        max="99"
        name=""
        id="session-a-minutes"
        className="mr-2 w-10 h-10 rounded-sm text-white bg-gray-400"
      />
      <input
        type="number"
        min="0"
        max="59"
        name=""
        className="text-white rounded-sm bg-gray-400"
        id="session-a-seconds"
      />
    </div>
  );

  const seshBTimerHTML = (
    <div id="session-b-timer">
      <p>{seshBTimer.name}</p>
      <h1>{seshBTimer.currentTime}</h1>
      <input
        type="number"
        min="0"
        max="99"
        name=""
        id="session-b-minutes"
        className="mr-2 text-white bg-gray-400"
      />
      <input
        className="text-white bg-gray-400"
        type="number"
        min="0"
        max="59"
        name=""
        id="session-b-seconds"
      />
    </div>
  );

  const timerControlBtns = (
    <div className="timer-control-btns">
      <button type="button" onClick={() => setModularModalKey('restart')}>
        <RestartIcon />
      </button>
      {seshATimer.status === 'paused' || seshBTimer.status === 'paused' ? (
        <button type="button" onClick={resumeTimer}>
          <PlayIcon />
        </button>
      ) : (
        <button type="button" onClick={pauseTimer}>
          <PauseIcon />
        </button>
      )}
      <button type="button" onClick={() => setModularModalKey('skip')}>
        <SkipIcon />
      </button>
      <button type="button" onClick={() => setModularModalKey('stop')}>
        <StopIcon />
      </button>
    </div>
  );

  function startPomodoro() {
    if (isEitherTimerActive()) {
      alert('Timer already active');
      return;
    }

    const sessionAMinutesInput = document.getElementById(
      'session-a-minutes',
    ) as HTMLInputElement;
    const sessionASecondsInput = document.getElementById(
      'session-a-seconds',
    ) as HTMLInputElement;
    const sessionBMinutesInput = document.getElementById(
      'session-b-minutes',
    ) as HTMLInputElement;
    const sessionBSecondsInput = document.getElementById(
      'session-b-seconds',
    ) as HTMLInputElement;

    const sessionAMinutes = sessionAMinutesInput?.value || '00';
    const sessionASeconds = sessionASecondsInput?.value || '00';
    const sessionBMinutes = sessionBMinutesInput?.value || '00';
    const sessionBSeconds = sessionBSecondsInput?.value || '00';

    if (
      setTimeIsInvalid(
        sessionAMinutes,
        sessionASeconds,
        sessionBMinutes,
        sessionBSeconds,
      ) === true
    ) {
      return;
    }

    const setTimeA = `${String(sessionAMinutes).padStart(2, '0')}:${String(sessionASeconds).padStart(2, '0')}`;
    const setTimeB = `${String(sessionBMinutes).padStart(2, '0')}:${String(sessionBSeconds).padStart(2, '0')}`;

    setSeshATimer((prev) => {
      let updated = updateTimerCurrentTime(prev, setTimeA);
      updated = updateTimerSetTime(updated, setTimeA);
      updated = updateTimerStatus(updated, true); // Start Session A
      return updated;
    });

    setSeshBTimer((prev) => {
      let updated = updateTimerCurrentTime(prev, setTimeB);
      updated = updateTimerSetTime(updated, setTimeB);
      updated = updateTimerStatus(updated, false); // Do NOT start Session B yet
      return updated;
    });
    setTimerControlBtnsAreVisible(true);
  }

  return (
    <div>
      <p>{timerStatusMessage}</p>
      <div className="timersDiv">
        {((seshATimer.status !== false && seshBTimer.status === false) ||
          (seshATimer.status === false && seshBTimer.status === false)) &&
          seshATimerHTML}

        {((seshATimer.status !== false && seshBTimer.status === true) ||
          (seshATimer.status === false && seshBTimer.status === false)) &&
          seshBTimerHTML}
      </div>
      {seshATimer.status === false && seshBTimer.status === false && (
        <button
          className="start-timer-btn text-white"
          type="button"
          onClick={startPomodoro}
        >
          GO!
        </button>
      )}

      {timerControlBtnsAreVisible && timerControlBtns}

      {modularModal}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
