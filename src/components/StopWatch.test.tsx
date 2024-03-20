import "@testing-library/jest-dom";

import { act, render, screen } from "@testing-library/react";

import StopWatch from "./StopWatch";

jest.useFakeTimers();

test("renders start button and starts timer", () => {
  render(<StopWatch />);

  const startButton = screen.getByRole("button", { name: /start/i });
  act(() => {
    startButton.click();
    jest.advanceTimersByTime(3000);
  });

  const timerDisplay = screen.getByRole("heading");
  expect(timerDisplay).toHaveTextContent("0:03.00");
});
