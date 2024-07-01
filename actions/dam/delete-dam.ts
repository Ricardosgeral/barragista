"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const deleteDam = async (damId: string) => {
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

    const dam = await db.dam.delete({
      where: {
        id: damId,
      },
    });

    return {
      ok: true,
      message: "Dam deleted",
      //dam,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: `Internal server error, ${error}`,
    };
  }
};
