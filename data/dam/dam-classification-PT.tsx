import { DamBody, DamClass, DamReservoir } from "@prisma/client";

export function DamClassificationPT(
  X: number | 0,
  Y: number | 0,
  hasInfrastructures: boolean | false,
): DamClass {
  if (Y >= 10 && X >= 1000) {
    return DamClass.I;
  } else if ((Y >= 10 && X < 1000) || (Y > 0 && Y < 10) || hasInfrastructures) {
    return DamClass.II;
  } else if (Y == 0) {
    return DamClass.III;
  }
  // Default case, if none of the above conditions are met
  return DamClass.Unknown;
}

// Function to calculate hazard_factor_X
export function hazardXFactorPT(
  damBody: DamBody | null,
  damReservoir: DamReservoir | null,
): number {
  if (!damBody?.height_to_foundation || !damReservoir?.total_capacity) return 0;
  const heightToFoundation = damBody?.height_to_foundation;
  const totalCapacity = damReservoir?.total_capacity;

  // Perform the calculation
  const hazardFactorX =
    Math.pow(heightToFoundation, 2) / Math.sqrt(totalCapacity / 1e6);
  return Math.round(hazardFactorX * 100) / 100; // 1decimals
}
// Function to calculate hazard_factor_X
export function potentialDamagePT(
  damClass: DamClass,
  has_pei: Boolean,
  persons_downstream: number,
): number {
  if (damClass === DamClass.I && !has_pei) {
    return 6;
  } else if (damClass === DamClass.I && has_pei) {
    return 4;
  } else if (damClass === DamClass.II && persons_downstream > 0) {
    return 3;
  } else if (damClass === DamClass.II && persons_downstream === 0) {
    return 2;
  } else if (damClass === DamClass.III) {
    return 1;
  }
  // Default case, if none of the above conditions are met
  return 0;
}
