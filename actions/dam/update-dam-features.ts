"use server";

import { currentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { dbMap, schemaMap } from "@/data/dam/dam-maps";

export const updateDamFeature = async (
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

    if (!damId) {
      return {
        ok: false,
        status: 400,
        message: "Dam Id is required",
      };
    }

    const schema = schemaMap[type];
    const parsedData = schema.parse(data);
    const serializedData = JSON.stringify(parsedData);

    cookies().set({
      name: `dam${type.charAt(0).toUpperCase() + type.slice(1)}`,
      value: serializedData,
      path: "/dam",
    });

    const dbModel = dbMap[type] as any;
    const updatedData = await dbModel.update({
      where: {
        damId: damId,
      },
      data: { ...parsedData, data_modified: new Date() },
    });

    return {
      ok: true,
      message: `Dam ${type.charAt(0).toUpperCase() + type.slice(1)} data updated`,
      updatedData,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: `Internal server error, ${error}`,
    };
  }
};
