import { usePomodoro, defaultState } from "./";
import { renderHook, act } from "@testing-library/react-hooks";

// mock timer using jest
jest.useFakeTimers();

describe("usePomodoro", () => {
  it("has correct initial state", () => {
    const { result } = renderHook(() => usePomodoro());

    expect(result.current.state).toEqual(defaultState);
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
    expect(result.current.state).toEqual({
      ...defaultState,
      timer: defaultState.timer - 1,
      paused: false,
    });

    // Fast-forward 1 more sec
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check after total 2 sec
    expect(result.current.state).toEqual({
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

    expect(result.current.state).toEqual({
      ...defaultState,
      timer: defaultState.timer - 1,
      paused: false,
    });

    act(() => {
      result.current.stop();
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.state).toEqual({
      ...defaultState,
      timer: defaultState.timer - 1,
    });
  });
});
