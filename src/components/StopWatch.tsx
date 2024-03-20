"use client";

import React, { useEffect, useRef, useState } from "react";

import { formatTime } from "@/utils/index";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  border: none;
`;

const ButtonWrapper = styled.div`
  margin: 30px;
  display: flex;
  justify-content: space-between;
`;

const StopWatchContainer = styled.div`
  width: 300px;
  margin: 0 auto;
  text-align: center;
  font-weight: bold;
`;

const LapsWrapper = styled.div``;

export default function StopWatch() {
  const [timer, setTimer] = useState(0);
  const [lapTime, setLapTime] = useState(0);
  const [laps, setLaps] = useState<{ lapTime: number; totalTime: number }[]>(
    []
  );
  const [running, setRunning] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastLapTimeRef = useRef<number | null>(null);

  const start = () => {
    const now = Date.now();
    if (!startTimeRef.current) {
      startTimeRef.current = now;
      lastLapTimeRef.current = now;
    }

    intervalRef.current = setInterval(() => {
      const delta = Date.now() - (startTimeRef.current || 0);
      setTimer((prevTimer) => prevTimer + delta / 1000);
      setLapTime((Date.now() - (lastLapTimeRef.current || 0)) / 1000);
      startTimeRef.current = Date.now();
    }, 100);
    setRunning(true);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if (startTimeRef.current) {
        const delta = Date.now() - startTimeRef.current;
        setTimer((prevTimer) => prevTimer + delta / 1000);
        setLapTime((Date.now() - (lastLapTimeRef.current || 0)) / 1000);
      }
    }
    setRunning(false);
  };

  const lap = () => {
    if (lastLapTimeRef.current) {
      const lapTime = (Date.now() - lastLapTimeRef.current) / 1000;
      setLaps([{ lapTime: lapTime, totalTime: timer }, ...laps]);
      setLapTime(0);
      lastLapTimeRef.current = Date.now();
    }
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimer(0);
    setLapTime(0);
    setLaps([]);
    setRunning(false);
    lastLapTimeRef.current = null;
    startTimeRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <StopWatchContainer>
      <h1 style={{ color: "#ffbd97" }}>{formatTime(timer)}</h1>
      <ButtonWrapper>
        <StyledButton
          style={{ backgroundColor: "#d7c9be" }}
          onClick={() => {
            if (running) {
              return lap();
            } else {
              setIsFirstRender(true);
              return reset();
            }
          }}
          disabled={isFirstRender}
        >
          {running || isFirstRender ? "Lap" : "Reset"}
        </StyledButton>
        <StyledButton
          style={{ backgroundColor: "#c6a353" }}
          onClick={() => {
            if (isFirstRender && !running) {
              setIsFirstRender(false);
            }
            if (running) {
              return stop();
            } else {
              return start();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </StyledButton>
      </ButtonWrapper>
      <div style={{ color: "#857480" }}>
        <LapsWrapper>
          {!isFirstRender ? (
            <p>
              Lap {laps.length + 1}: {formatTime(lapTime)}
            </p>
          ) : null}
          {laps.map((lap, index) => {
            return (
              <p key={index}>
                Lap {laps.length - index}: {formatTime(lap.lapTime)}
              </p>
            );
          })}
        </LapsWrapper>
      </div>
    </StopWatchContainer>
  );
}
