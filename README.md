# use-pomodoro

> Use pomodoro in a hook

[![NPM](https://img.shields.io/npm/v/use-pomodoro.svg)](https://www.npmjs.com/package/use-pomodoro) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-pomodoro
```

## Basic Usage

```tsx
import * as React from "react";
import { usePomodoro } from "use-pomodoro";

const Example = () => {
  const {
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
  } = usePomodoro();
  return <div>{example}</div>;
};
```

## Context usage

```tsx
import * as React from "react";
import { PomodoroProvider } from "use-pomodoro";

const Example = () => {
  return (
    <PomodoroProvider>
      <Navbar />
      <App />
      <Footer />
    </PomodoroProvider>
  )
};

// Navbar
const Navbar = () => {
  const { state, start, ...rest } = usePomodoroContext();
}

// Footer
const Footer = () => {
  const { formattedTimer, start, stop ...rest } = usePomodoroContext();
}
```

## License

MIT © [kacgrzes](https://github.com/kacgrzes)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).