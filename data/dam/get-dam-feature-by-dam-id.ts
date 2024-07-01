import { dbMap, schemaMap } from "@/data/dam/dam-maps";

export const getDamFeatureByDamId = async (
  type: keyof typeof schemaMap,
  damId: string,
) => {
  try {
    const dbModel = dbMap[type] as any;
    const damFeature = await dbModel.findMany({
      where: { damId },
    });

    if (!damFeature || damFeature.length === 0) return null;
    return damFeature;
  } catch (error: any) {
    throw new Error(error);
  }
};
