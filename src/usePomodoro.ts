import {
  useCallback,
  useReducer,
  createContext,
  FC,
  useContext,
  useMemo,
  createElement,
} from "react";
import { useInterval } from "./useInterval";

type NotificationType = "last" | "every";
type NotificationConfig = {
  type: NotificationType;
  time: number;
};

type PomodoroType = "pomodoro" | "shortBreak" | "longBreak";
type PomodoroConfig = {
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
  type: PomodoroType;
  timer: number;
  paused: boolean;
  config: PomodoroConfig;
};

export const defaultState: PomodoroState = {
  timer: defaultConfig.pomodoro,
  paused: true,
  type: "pomodoro",
  config: defaultConfig,
};

type PomodoroNoPayloadActionType = "tick" | "start" | "stop" | "reset";

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
  | PomodoroChangeConfigAction;

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
        type: "pomodoro",
        paused: true,
        timer: state.config.pomodoro,
        config: state.config,
      };
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

const init = (state: PomodoroState) => state;

const tickAction: PomodoroAction = { type: "tick" };
const startAction: PomodoroAction = { type: "start" };
const stopAction: PomodoroAction = { type: "stop" };
const resetAction: PomodoroAction = { type: "reset" };
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

export const usePomodoro = (config: PomodoroConfig = defaultConfig) => {
  // reducer setup
  const [state, dispatch] = useReducer(
    reducer,
    { ...defaultState, config },
    init
  );

  // actions
  const tick = useCallback(() => dispatch(tickAction), [dispatch]);
  const start = useCallback(() => dispatch(startAction), [dispatch]);
  const stop = useCallback(() => dispatch(stopAction), [dispatch]);
  const reset = useCallback(() => dispatch(resetAction), [dispatch]);
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
  useInterval(tick, state.paused ? null : 1000);

  const formattedTimer = useMemo(() => formatTime(state.timer), [state.timer]);

  return {
    state,
    dispatch,
    start,
    stop,
    reset,
    goPomodoro,
    goShortBreak,
    goLongBreak,
    changeConfig,
    formattedTimer,
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
