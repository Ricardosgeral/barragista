"use server";

import { currentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { dbMap } from "@/data/dam/dam-maps";

export const deleteDamFeature = async (
  type: keyof typeof dbMap,
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

    const dbModel = dbMap[type] as any;
    const deletedData = await dbModel.delete({
      where: {
        damId: damId,
      },
    });

    // Delete the corresponding cookie
    cookies().set({
      name: `dam${type.charAt(0).toUpperCase() + type.slice(1)}Info`,
      value: "",
      path: "/dam",
      maxAge: -1, // This will cause the cookie to be deleted
    });

    return {
      ok: true,
      message: `Dam ${type.charAt(0).toUpperCase() + type.slice(1)} data deleted`,
      deletedData,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: `Internal server error, ${error}`,
    };
  }
};
