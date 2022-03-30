import React from "react";

import { usePomodoro } from "use-pomodoro";

const App = () => {
  const { state } = usePomodoro();
  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
export default App;
