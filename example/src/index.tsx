import ReactDOM from "react-dom";
import { PomodoroProvider } from "use-pomodoro";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <PomodoroProvider>
    <App />
  </PomodoroProvider>,
  document.getElementById("root")
);
