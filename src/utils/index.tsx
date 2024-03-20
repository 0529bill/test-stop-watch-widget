const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${hours > 0 ? hours.toFixed(0).padStart(2, "0") + ":" : ""}${minutes
    .toFixed(0)
    .padStart(2, "0")}:${seconds.toFixed(2).padStart(5, "0")}`;
};

export { formatTime };
