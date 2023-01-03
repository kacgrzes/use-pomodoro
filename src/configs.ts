import { PomodoroConfig } from "./types";

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

export const testConfig: PomodoroConfig = {
  pomodoro: 5,
  shortBreak: 2,
  longBreak: 3,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  notificationConfig: {
    time: 5 * 60,
    type: "last",
  },
};
