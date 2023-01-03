import { usePomodoro, defaultState } from "./";
import { renderHook, act } from "@testing-library/react-hooks";

// mock timer using jest
jest.useFakeTimers();

describe("usePomodoro", () => {
  it("has correct initial state", () => {
    const { result } = renderHook(() => usePomodoro());

    expect(result.current.state).toMatchObject(defaultState);
  });

  it("updates every second", () => {
    const { result } = renderHook(() => usePomodoro());

    act(() => {
      result.current.start();
    });

    // Fast-forward 1sec
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check after total 1 sec
    expect(result.current.state).toMatchObject({
      ...defaultState,
      timer: defaultState.timer - 1,
      paused: false,
    });

    // Fast-forward 1 more sec
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check after total 2 sec
    expect(result.current.state).toMatchObject({
      ...defaultState,
      timer: defaultState.timer - 2,
      paused: false,
    });
  });

  it("starts and stops", () => {
    const { result } = renderHook(() => usePomodoro());

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.state.timer).toEqual(defaultState.timer - 1);

    act(() => {
      result.current.stop();
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.state.timer).toBe(defaultState.timer - 1);
  });

  it("automatically starts pomodoros", () => {
    const { result } = renderHook(() =>
      usePomodoro({ autoStartPomodoros: true, pomodoro: 5 })
    );

    expect(result.current.state.timer).toBe(5);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.state.timer).toBe(4);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.state.timer).toBe(3);
  });

  it("automatically starts breaks", () => {
    const { result } = renderHook(() =>
      usePomodoro({
        autoStartPomodoros: true,
        autoStartBreaks: true,
        pomodoro: 2,
      })
    );

    expect(result.current.state.timer).toBe(2);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.state.type).toBe("shortBreak");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.state.timer).toBe(defaultState.config.shortBreak - 1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.state.timer).toBe(defaultState.config.shortBreak - 2);
  });
});
