type NotificationType = "last" | "every";
type NotificationConfig = {
  type: NotificationType;
  time: number;
};

export type PomodoroCallbacks = {
  onTick?: (state: PomodoroState) => void;
  onStart?: (state: PomodoroState) => void;
  onStop?: (state: PomodoroState) => void;
  onToggle?: (state: PomodoroState) => void;
  onReset?: (state: PomodoroState) => void;
  onNext?: (state: PomodoroState) => void;
  onChangeType?: (state: PomodoroState) => void;
  onChangeConfig?: (state: PomodoroState) => void;
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

export type PomodoroAction =
  | {
      type: PomodoroNoPayloadActionType;
    }
  | PomodoroChangeTypeAction
  | PomodoroChangeConfigAction
  | PomodoroNextAction;
