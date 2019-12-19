export function convertFromCMToFeetAndInches(value: number): string {
  const valueInInches = value * 0.3937;

  if (valueInInches < 12) {
    return `${(valueInInches * 100) / 100} inches`;
  }

  const valueInFeet = Math.floor(valueInInches / 12);
  const remainingValueInInches = Math.floor((valueInInches % 12) * 100) / 100;

  if (!remainingValueInInches) {
    return `${valueInFeet}ft`;
  }

  return `${valueInFeet}ft ${remainingValueInInches} inches`;
}
