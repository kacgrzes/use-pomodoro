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

export type PomodoroState = {
  config: PomodoroConfig;
  paused: boolean;
  pomodoros: number;
  timer: number;
  type: PomodoroType;
};

type PomodoroNoPayloadActionType = "start" | "stop" | "reset";

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

export type PomodoroAction =
  | {
      type: PomodoroNoPayloadActionType;
    }
  | PomodoroChangeTypeAction
  | PomodoroChangeConfigAction
  | PomodoroNextAction
  | {
      type: "tick";
      payload: number;
    }

// TODO: do something with it :)
// type PomodoroCallbacks = {
//   onTick: () => void;
//   onStart: () => void;
//   onStop: () => void;
//   onReset: () => void;
//   onChangeType: (type: PomodoroType) => void;
//   onChangeConfig: (config: Partial<PomodoroConfig>) => void;
// };