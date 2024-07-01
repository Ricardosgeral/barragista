import { db } from "@/lib/db";

export const getDamById = async (damId: string) => {
  try {
    const dam = await db.dam.findUnique({
      where: { id: damId },
      // include: {
      //   damLocation: true,
      //   damProject: true,
      //   damHydrology: true,
      //   damReservoir: true,
      //   damBody: true,
      //   damFoundation: true,
      //   damBtDischarge: true,
      //   damSpillway: true,
      //   damEnvFlow: true,
      //   damHydropower: true,
      //   damRisk: true,
      //   damFiles: true,
      // },
    });

    if (!dam) return null;
    return dam;
  } catch (error: any) {
    throw new Error(error);
  }
};
