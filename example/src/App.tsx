import { usePomodoroContext } from "use-pomodoro";
import { ButtonHTMLAttributes, useMemo, forwardRef } from "react";
import { FastForwardIcon } from "@heroicons/react/solid";
import {
  Provider,
  Root,
  Trigger,
  Content,
  Arrow,
} from "@radix-ui/react-tooltip";
import { FC } from "react";
import * as Progress from "@radix-ui/react-progress";

const PomodoroProgress = () => {
  const { state } = usePomodoroContext();
  // TODO: add pomodoro progress to use-pomodoro package
  return (
    <Progress.Root className="w-full bg-white rounded-t h-2" value={25}>
      <Progress.Indicator
        className="bg-primary-600/50 h-2 rounded-t"
        style={{
          width: state.progressInPercent,
        }}
      />
    </Progress.Root>
  );
};

type TooltipProps = {
  content: string;
};

export const Tooltip: FC<TooltipProps> = ({ children, content }) => (
  <Provider>
    <Root>
      <Trigger asChild>{children}</Trigger>
      <Content
        sideOffset={2}
        side="top"
        className="bg-slate bg-slate-900 rounded p-2 text-xs text-white"
      >
        <Arrow fill="none" className="fill-slate-900" />
        {content}
      </Content>
    </Root>
  </Provider>
);

type Size = "xs" | "sm" | "md" | "lg" | "xl";

type Variant = "primary" | "secondary" | "white" | "outline";

type HeroIconComponent = (props: React.ComponentProps<"svg">) => JSX.Element;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type CustomButtonProps = {
  size?: Size;
  variant?: Variant;
  leadingIcon?: HeroIconComponent;
  trailingIcon?: HeroIconComponent;
};

type Props = ButtonProps & CustomButtonProps;

const commonStyles = `inline-flex items-center border-2 border-transparent font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`;

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      size = "md",
      variant = "primary",
      children,
      className,
      disabled,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      ...rest
    },
    ref
  ) => {
    const sizeStyles = useMemo(() => {
      return {
        xs: "px-2.5 py-1.5 text-xs rounded",
        sm: "px-3 py-2 text-sm leading-4 rounded-md",
        md: "px-4 py-2 text-sm rounded-md",
        lg: "px-4 py-2 text-base rounded-md",
        xl: "px-6 py-3 text-base rounded-md",
      }[size];
    }, [size]);

    const variantStyles = useMemo(() => {
      return {
        primary:
          "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white",
        secondary:
          "text-secondary-700 bg-secondary-100 hover:bg-secondary-200 focus:ring-secondary-500",
        white: "text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500",
        outline:
          "text-primary-500 bg-transparent hover:bg-transparent/[0.2] focus:ring-primary-500 border-primary-500",
      }[variant];
    }, [variant]);

    const disabledStyles = useMemo(() => {
      return disabled
        ? "cursor-not-allowed bg-gray-500 hover:bg-gray-500 text-gray-400 border-gray-500"
        : "";
    }, [disabled]);

    const leadingIconStyles = useMemo(() => {
      return {
        xs: "hidden",
        sm: "-ml-0.5 mr-2 h-4 w-4",
        md: "-ml-1 mr-2 h-5 w-5",
        lg: "-ml-1 mr-3 h-5 w-5",
        xl: "-ml-1 mr-3 h-5 w-5",
      }[size];
    }, [size]);

    const trailingIconStyles = useMemo(() => {
      return {
        xs: "hidden",
        sm: "ml-2 -mr-0.5 h-4 w-4",
        md: "ml-2 -mr-1 h-5 w-5",
        lg: "ml-3 -mr-1 h-5 w-5",
        xl: "ml-3 -mr-1 h-5 w-5",
      }[size];
    }, [size]);

    return (
      <button
        type="button"
        ref={ref}
        disabled={disabled}
        className={`${commonStyles} ${sizeStyles} ${variantStyles} ${disabledStyles} ${className}`}
        {...rest}
      >
        {LeadingIcon && (
          <LeadingIcon className={leadingIconStyles} aria-hidden="true" />
        )}
        {children}
        {TrailingIcon && (
          <TrailingIcon className={trailingIconStyles} aria-hidden="true" />
        )}
      </button>
    );
  }
);

type Tab = {
  name: string;
  type: string;
};

const tabs: Tab[] = [
  { name: "Pomodoro", type: "pomodoro" },
  { name: "Short Break", type: "shortBreak" },
  { name: "Long Break", type: "longBreak" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function TimerTypeTabs() {
  const { state, goPomodoro, goShortBreak, goLongBreak } = usePomodoroContext();

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
          value={state.type}
        >
          {tabs.map((tab) => (
            <option key={tab.type}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={
                {
                  pomodoro: goPomodoro,
                  shortBreak: goShortBreak,
                  longBreak: goLongBreak,
                }[tab.type]
              }
              className={classNames(
                state.type === tab.type
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-500 hover:text-gray-700",
                "px-3 py-2 font-medium text-sm rounded-md"
              )}
              aria-current={state.type === tab.type ? "page" : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

const App = () => {
  const { state, toggle, next } = usePomodoroContext();
  console.log(state);
  return (
    <>
      <main className="w-screen h-screen bg-primary-100 flex justify-center items-center">
        <div className="flex flex-row gap-4">
          <div className="bg-white rounded flex-shrink">
            <PomodoroProgress />
            <div className="flex flex-col p-6">
              <TimerTypeTabs />
              <p className="text-center text-3xl mt-4">
                {state.formattedTimer}
              </p>
              <div className="flex flex-row mt-6">
                <div className="flex-1" />
                <Button
                  variant="primary"
                  className="uppercase flex-1 justify-center"
                  size="sm"
                  onClick={toggle}
                >
                  {state.paused ? "Start" : "Stop"}
                </Button>
                <div className="flex-1 flex justify-center items-center">
                  {!state.paused && (
                    // TODO: implement this in use-pomodoro package
                    <Tooltip content={`Skip forward to short break`}>
                      <FastForwardIcon
                        className="h-6 w-6 cursor-pointer"
                        // TODO: implement this is use-pomodoro package
                        onClick={next}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-4 inline-block">
              Current state:
            </span>
            <pre>{JSON.stringify(state, null, 2)}</pre>
          </div>
        </div>
      </main>
    </>
  );
};
export default App;
