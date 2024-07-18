"use server";

import { hazardXFactorPT } from "@/data/dam/dam-classification-PT";
import { db } from "@/lib/db";

export const setHazardX = async (damId: string) => {
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
      // Retrieve damBody and damReservoir to get height and volume
      const damBody = await db.damBody.findUnique({
        where: {
          damId: damId,
        },
      });

      const damReservoir = await db.damReservoir.findUnique({
        where: {
          damId: damId,
        },
      });

      if (!damBody || !damReservoir) {
        return {
          ok: false,
          status: 404,
          message: "Dam Body or Dam Reservoir not found",
        };
      }

      const updatedHazard_factor_X = hazardXFactorPT(damBody, damReservoir);

      // Update damRisk
      const updatedDamRisk = await db.damRisk.update({
        where: {
          id: damRisk.id,
        },
        data: {
          hazard_factor_X: updatedHazard_factor_X,
          data_modified: new Date(),
        },
      });

      return {
        ok: true,
        message: "Dam Risk updated",
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
