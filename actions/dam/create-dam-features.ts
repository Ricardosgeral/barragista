"use server";

import { dbMap, schemaMap } from "@/data/dam/dam-maps";
import { currentUser } from "@/lib/auth";

import { cookies } from "next/headers";

export const createDamFeature = async (
  type: keyof typeof schemaMap,
  data: any,
  damId: string,
) => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        ok: false,
        status: 401,
        message: "Access unauthorized",
      };
    }

    const schema = schemaMap[type];
    const parsedData = schema.parse(data);
    const serializedData = JSON.stringify(parsedData);
    cookies().set({
      name: `dam${type.charAt(0).toUpperCase() + type.slice(1)}Info`,
      value: serializedData,
      path: "/dam",
    });

    const dbModel = dbMap[type] as any;
    const damData = await dbModel.create({
      data: { ...parsedData, damId },
    });

    return {
      ok: true,
      message: `Dam ${type.charAt(0).toUpperCase() + type.slice(1)} data added`,
      damData,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: `Internal server error, ${error}`,
    };
  }
};
