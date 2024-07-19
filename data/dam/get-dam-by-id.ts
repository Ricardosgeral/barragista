import { db } from "@/lib/db";
import { cache } from "react";

export const getDamById = cache(async (damId: string) => {
  try {
    const dam = await db.dam.findUnique({
      where: { id: damId },
      include: {
        damLocation: true,
        damProject: true,
        damHydrology: true,
        damReservoir: true,
        damBody: true,
        damFoundation: true,
        damDischarge: true,
        damSpillway: true,
        damEnvironmental: true,
        damHydropower: true,
        damRisk: true,
        damFiles: true,
      },
    });

    if (!dam) return null;
    return dam;
  } catch (error: any) {
    throw new Error(error);
  }
});
