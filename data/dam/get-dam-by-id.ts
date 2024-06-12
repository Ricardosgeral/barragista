import { db } from "@/lib/db";

export const getDamById = async (damId: string) => {
  try {
    const dam = await db.dam.findUnique({
      where: { id: damId },
      include: { files: true },
    });

    if (!dam) return null;
    return dam;
  } catch (error: any) {
    throw new Error(error);
  }
};
