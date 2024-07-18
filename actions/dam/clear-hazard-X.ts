"use server";

import { db } from "@/lib/db";

export const clearHazardX = async (damId: string) => {
  try {
    if (!damId) {
      return {
        ok: false,
        status: 400,
        message: "Dam Id is required",
      };
    }

    // Retrieve damRisk for the given damId
    const damRisk = await db.damRisk.findUnique({
      where: {
        damId: damId,
      },
    });

    // Only proceed if damRisk exists
    if (damRisk) {
      // clear damRisk.hazard_factor_X
      const updatedDamRisk = await db.damRisk.update({
        where: {
          id: damRisk.id,
        },
        data: {
          hazard_factor_X: 0,
          data_modified: new Date(),
        },
      });

      return {
        ok: true,
        message: "Hazard Factor X cleared",
        damRisk: updatedDamRisk,
      };
    } else {
      return {
        ok: false,
        status: 404,
        message: "Dam Risk not found",
      };
    }
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: `Internal server error, ${error}`,
    };
  }
};
