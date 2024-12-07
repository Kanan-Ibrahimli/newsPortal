// utils/calculationUtils.js
const calculateSolarPowerMonth = (
  batteryVoltage,
  dailyPowerRequirement,
  averageEnergyMonth,
  daysInMonth
) => {
  return (
    (batteryVoltage * dailyPowerRequirement) /
    (averageEnergyMonth / daysInMonth)
  );
};

const calculateElectricityBalance = (
  averageEnergyMonth,
  daysInMonth,
  solarPower,
  batteryVoltage,
  dailyPowerRequirement
) => {
  return (
    (averageEnergyMonth / daysInMonth) * solarPower * 0.75 -
    dailyPowerRequirement / batteryVoltage
  );
};

module.exports = { calculateSolarPowerMonth, calculateElectricityBalance };
