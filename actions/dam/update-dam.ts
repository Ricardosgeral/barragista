"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { DamSchema } from "@/schemas/dam-schema";

export const updateDam = async (
  data: z.infer<typeof DamSchema>,
  damId: string,
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        ok: false,
        status: 401,
        message: "Access Unauthorized",
      };
    }

    if (!damId) {
      return {
        ok: false,
        status: 400,
        message: "Dam Id is required",
      };
    }
    const dam = await db.dam.update({
      where: {
        id: damId,
      },
      data: { ...data },
    });

    return {
      ok: true,
      message: "Dam updated",

      dam,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: `Internal server error, ${error}`,
    };
  }
};
