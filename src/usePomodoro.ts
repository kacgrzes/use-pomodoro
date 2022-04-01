import {
  useCallback,
  useReducer,
  createContext,
  FC,
  useContext,
  useMemo,
  createElement,
  useEffect,
} from "react";
import { useInterval } from "./useInterval";

type NotificationType = "last" | "every";
type NotificationConfig = {
  type: NotificationType;
  time: number;
};

export type PomodoroType = "pomodoro" | "shortBreak" | "longBreak";
export type PomodoroConfig = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  notificationConfig: NotificationConfig;
};

export const defaultConfig: PomodoroConfig = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  notificationConfig: {
    time: 5 * 60,
    type: "last",
  },
};

type PomodoroState = {
  config: PomodoroConfig;
  paused: boolean;
  pomodoros: number;
  timer: number;
  type: PomodoroType;
};

export const defaultState: PomodoroState = {
  config: defaultConfig,
  paused: true,
  pomodoros: 0,
  timer: defaultConfig.pomodoro,
  type: "pomodoro",
};

type PomodoroNoPayloadActionType = "tick" | "start" | "stop" | "reset";

type PomodoroNextAction = {
  type: "next";
  payload: PomodoroType;
};

type PomodoroChangeTypeAction = {
  type: "changeType";
  payload: PomodoroType;
};

type PomodoroChangeConfigAction = {
  type: "changeConfig";
  payload: Partial<PomodoroConfig>;
};

type PomodoroAction =
  | {
      type: PomodoroNoPayloadActionType;
    }
  | PomodoroChangeTypeAction
  | PomodoroChangeConfigAction
  | PomodoroNextAction;

// TODO: do something with it :)
// type PomodoroCallbacks = {
//   onTick: () => void;
//   onStart: () => void;
//   onStop: () => void;
//   onReset: () => void;
//   onChangeType: (type: PomodoroType) => void;
//   onChangeConfig: (config: Partial<PomodoroConfig>) => void;
// };

const reducer = (
  state: PomodoroState,
  action: PomodoroAction
): PomodoroState => {
  switch (action.type) {
    case "tick": {
      return {
        ...state,
        timer: state.timer - 1,
      };
    }
    case "start":
      return {
        ...state,
        paused: false,
      };
    case "stop":
      return {
        ...state,
        paused: true,
      };
    case "reset":
      return {
        config: state.config,
        paused: true,
        pomodoros: 0,
        timer: state.config.pomodoro,
        type: "pomodoro",
      };
    case "next": {
      const { type, pomodoros } = state;
      const nextType = action.payload;
      return {
        ...state,
        type: nextType,
        timer: state.config[nextType],
        paused: true,
        pomodoros: type === "pomodoro" ? pomodoros + 1 : pomodoros,
      };
    }
    case "changeType": {
      const payload = action.payload;
      return {
        ...state,
        type: action.payload,
        timer: state.config[payload],
        paused: true,
      };
    }
    case "changeConfig": {
      const payload = action.payload;
      return {
        ...state,
        config: {
          ...state.config,
          ...payload,
        },
        timer: payload.pomodoro ?? state.config.pomodoro,
        paused: true,
        type: "pomodoro",
      };
    }
    default:
      return state;
  }
};

const tickAction: PomodoroAction = { type: "tick" };
const startAction: PomodoroAction = { type: "start" };
const stopAction: PomodoroAction = { type: "stop" };
const resetAction: PomodoroAction = { type: "reset" };
const nextAction = (payload: PomodoroType): PomodoroAction => ({
  type: "next",
  payload,
});
const changeTypeAction = (payload: PomodoroType): PomodoroAction => ({
  type: "changeType",
  payload,
});
const changeConfigAction = (
  payload: Partial<PomodoroConfig>
): PomodoroAction => ({
  type: "changeConfig",
  payload,
});

const formatTime = (timeInSeconds: string | number) => {
  if (typeof timeInSeconds !== "string" && typeof timeInSeconds !== "number") {
    throw new Error("Time must be a string or a number.");
  }

  const parsedTimeInSeconds =
    typeof timeInSeconds === "string"
      ? parseInt(timeInSeconds, 10)
      : timeInSeconds;

  if (isNaN(parsedTimeInSeconds)) {
    throw new Error("Time cannot be parsed.");
  }

  if (parsedTimeInSeconds < 0) {
    throw new Error("Time cannot be a negative value.");
  }

  const minutes = Math.floor(parsedTimeInSeconds / 60);
  const seconds = parsedTimeInSeconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

// const testConfig: PomodoroConfig = {
//   pomodoro: 5,
//   shortBreak: 2,
//   longBreak: 3,
//   autoStartBreaks: false,
//   autoStartPomodoros: false,
//   longBreakInterval: 4,
//   notificationConfig: {
//     time: 5 * 60,
//     type: "last",
//   },
// };

const init = (state: PomodoroState): PomodoroState => {
  const { config } = state;
  return {
    ...state,
    timer: config.pomodoro,
  };
};

export const usePomodoro = (config: PomodoroConfig = defaultConfig) => {
  const [rawState, dispatch] = useReducer(
    reducer,
    { ...defaultState, config },
    init
  );

  // actions
  const tick = useCallback(() => dispatch(tickAction), [dispatch]);
  const start = useCallback(() => dispatch(startAction), [dispatch]);
  const stop = useCallback(() => dispatch(stopAction), [dispatch]);
  const reset = useCallback(() => dispatch(resetAction), [dispatch]);
  const toggle = useMemo(
    () => (rawState.paused ? start : stop),
    [rawState.paused]
  );
  const changeType = useCallback(
    (type: PomodoroType) => dispatch(changeTypeAction(type)),
    [dispatch]
  );
  const changeConfig = useCallback(
    (config: PomodoroConfig) => dispatch(changeConfigAction(config)),
    [dispatch]
  );
  const goPomodoro = useCallback(() => changeType("pomodoro"), [changeType]);
  const goShortBreak = useCallback(
    () => changeType("shortBreak"),
    [changeType]
  );
  const goLongBreak = useCallback(() => changeType("longBreak"), [changeType]);

  // timer setup
  useInterval(tick, rawState.paused ? null : 1000);

  const formattedTimer = useMemo(
    () => formatTime(rawState.timer),
    [rawState.timer]
  );

  const progress = useMemo(() => {
    const { type, timer, config } = rawState;
    const currentTimerFromConfig = config[type];

    return Number((1 - timer / currentTimerFromConfig).toFixed(3));
  }, [rawState]);

  const progressInPercent = useMemo(
    () => (progress * 100).toFixed(2) + "%",
    [progress]
  );

  const nextType: PomodoroType = useMemo(() => {
    const { type, config, pomodoros } = rawState;
    if (type === "shortBreak" || type === "longBreak") {
      return "pomodoro";
    }

    if (
      type === "pomodoro" &&
      pomodoros > 0 &&
      (pomodoros + 1) % config.longBreakInterval === 0
    ) {
      return "longBreak";
    }

    return "shortBreak";
  }, [rawState.type]);

  const next = useCallback(
    () => dispatch(nextAction(nextType)),
    [dispatch, nextType]
  );

  useEffect(() => {
    if (rawState.timer === 0) {
      next();
    }
  }, [rawState.timer]);

  const derivedState = {
    formattedTimer,
    progress,
    progressInPercent,
    nextType,
  };

  const state = {
    ...rawState,
    ...derivedState,
  };

  return {
    state,
    dispatch,
    start,
    stop,
    reset,
    toggle,
    next,
    goPomodoro,
    goShortBreak,
    goLongBreak,
    changeConfig,
  };
};

type PomodoroContextType = ReturnType<typeof usePomodoro>;
const PomodoroContext = createContext<PomodoroContextType | null>(null);
const { Provider } = PomodoroContext;

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (context === null) {
    throw new Error(
      "usePomodoroContext must be used within a PomodoroProvider"
    );
  }
  return context;
};

type PomodoroProviderProps = {
  config?: PomodoroConfig;
};

export const PomodoroProvider: FC<PomodoroProviderProps> = ({
  children,
  config,
}) => {
  const pomodoro = usePomodoro(config);

  return createElement(Provider, { value: pomodoro }, children);
};
