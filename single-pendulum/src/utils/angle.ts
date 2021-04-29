export const toRadians = (degrees: number) => {
  return (degrees / 180) * Math.PI;
};

export const toDegrees = (radians: number) => {
  return (radians * 180) / Math.PI;
};
