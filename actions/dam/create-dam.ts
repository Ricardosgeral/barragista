"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { DamSchema } from "@/schemas/dam-schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createDam = async (data: z.infer<typeof DamSchema>) => {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!user) {
      return {
        ok: false,
        status: 401,
        message: "Access Unauthorized",
      };
    }

    if (data.name) {
      const serializedDamInfo = JSON.stringify(data);

      cookies().set({
        name: "damInfo",
        value: serializedDamInfo,
        path: "/dam",
      });

      //redirect("/dam/location");
    }

    // Check if the dam name already exists
    const existingDam = await db.dam.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existingDam) {
      return {
        ok: false,
        status: 400,
        message: "Dam name already exists",
      };
    }

    const dam = await db.dam.create({
      data: { ...data, userId },
    });

    return {
      ok: true,
      message: "Dam info created",
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
