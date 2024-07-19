"use client";

import { DamRiskSchema } from "@/schemas/dam-schema";
import { DamBody, DamReservoir } from "@prisma/client";
import { UseFormReturn } from "react-hook-form"; // Importing type for form instance

import { useEffect, useState } from "react";
import { z } from "zod";
import {
  DamClassificationPT,
  hazardXFactorPT,
  potentialDamagePT,
} from "@/data/dam/dam-classification-PT";

const useDamRiskEffectsPT = (
  form: UseFormReturn<z.infer<typeof DamRiskSchema>>, // Correct type for form instance
  damBody: DamBody | null,
  damReservoir: DamReservoir | null,
): { hasPei: boolean; hasInfrastructures: boolean } => {
  const [hasInfrastructures, setHasInfrastructures] = useState(false);
  const [hasPei, setHasPei] = useState(false);

  // calculate X on page render first time
  useEffect(() => {
    form.setValue("hazard_factor_X", hazardXFactorPT(damBody, damReservoir));
  }, [form, damBody, damReservoir]);

  // check if X or Y or Infrastructure is introduced by user and compute class
  useEffect(() => {
    const hazard_X = form.getValues("hazard_factor_X");
    const houses_Y = form.watch("houses_downstream");
    const has_infrastructures = form.watch("has_infrastructures");

    const dam_class = DamClassificationPT(
      hazard_X as number,
      houses_Y as number,
      has_infrastructures as boolean,
    );
    form.setValue("class", dam_class);
    setHasInfrastructures(!!has_infrastructures);
  }, [
    form,
    form.watch("houses_downstream"),
    form.watch("has_infrastructures"),
  ]);

  // check if any risk factor for E (alphas_E) is changed
  useEffect(() => {
    const alpha_1 = form.watch("sismicity");
    const alpha_2 = form.watch("geo_conditions");
    const alpha_3 = form.watch("design_flow");
    const alpha_4 = form.watch("reservoir_management");
    const alpha_5 = form.watch("env_harshness");

    // Check if any of the values are undefined or "0" as strings
    if (
      alpha_1 === undefined ||
      alpha_2 === undefined ||
      alpha_3 === undefined ||
      alpha_4 === undefined ||
      alpha_5 === undefined
    ) {
      return;
    }

    // Convert the values to numbers if they are not already parsed
    const parsedAlpha_1 =
      typeof alpha_1 === "string" ? parseFloat(alpha_1) : alpha_1;
    const parsedAlpha_2 =
      typeof alpha_2 === "string" ? parseFloat(alpha_2) : alpha_2;
    const parsedAlpha_3 =
      typeof alpha_3 === "string" ? parseFloat(alpha_3) : alpha_3;
    const parsedAlpha_4 =
      typeof alpha_4 === "string" ? parseFloat(alpha_4) : alpha_4;
    const parsedAlpha_5 =
      typeof alpha_5 === "string" ? parseFloat(alpha_5) : alpha_5;

    // Calculate the average risk_E
    let risk_E = 0;
    if (
      parsedAlpha_1 !== 0 &&
      parsedAlpha_2 !== 0 &&
      parsedAlpha_3 !== 0 &&
      parsedAlpha_4 !== 0 &&
      parsedAlpha_5 !== 0
    ) {
      risk_E =
        (parsedAlpha_1 +
          parsedAlpha_2 +
          parsedAlpha_3 +
          parsedAlpha_4 +
          parsedAlpha_5) /
        5;
    } else {
      form.setValue("risk_global", 0);
    }
    form.setValue("risk_E", risk_E);
  }, [
    form,
    form.watch("sismicity"),
    form.watch("geo_conditions"),
    form.watch("design_flow"),
    form.watch("reservoir_management"),
    form.watch("env_harshness"),
  ]);

  // check if any risk factor for V (alphas_V) is changed
  useEffect(() => {
    const alpha_6 = form.watch("project_construction");
    const alpha_7 = form.watch("foundations");
    const alpha_8 = form.watch("discharge_structures");
    const alpha_9 = form.watch("maintenance");

    // Check if any of the values are undefined or "0" as strings
    if (
      alpha_6 === undefined ||
      alpha_7 === undefined ||
      alpha_8 === undefined ||
      alpha_9 === undefined
    ) {
      return;
    }

    // Convert the values to numbers if they are not already parsed
    const parsedAlpha_6 =
      typeof alpha_6 === "string" ? parseFloat(alpha_6) : alpha_6;
    const parsedAlpha_7 =
      typeof alpha_7 === "string" ? parseFloat(alpha_7) : alpha_7;
    const parsedAlpha_8 =
      typeof alpha_8 === "string" ? parseFloat(alpha_8) : alpha_8;
    const parsedAlpha_9 =
      typeof alpha_9 === "string" ? parseFloat(alpha_9) : alpha_9;

    // Calculate the average risk_V
    let risk_V = 0;
    if (
      parsedAlpha_6 !== 0 &&
      parsedAlpha_7 !== 0 &&
      parsedAlpha_8 !== 0 &&
      parsedAlpha_9 !== 0
    ) {
      risk_V =
        (parsedAlpha_6 + parsedAlpha_7 + parsedAlpha_8 + parsedAlpha_9) / 4;
    } else {
      form.setValue("risk_global", 0);
    }
    form.setValue("risk_V", risk_V);
  }, [
    form,
    form.watch("project_construction"),
    form.watch("foundations"),
    form.watch("discharge_structures"),
    form.watch("maintenance"),
  ]);

  // potential damage factor
  useEffect(() => {
    const damClassPT = form.watch("class");
    const has_pei = form.watch("has_pei");
    const persons = form.watch("persons_downstream");
    const risk_D = potentialDamagePT(
      damClassPT,
      has_pei as boolean,
      persons as number,
    );
    form.setValue("risk_D", risk_D);
  }, [
    form,
    form.watch("class"),
    form.watch("has_pei"),
    form.watch("persons_downstream"),
  ]);

  // calculate global risk
  useEffect(() => {
    const risk_E = form.watch("risk_E");
    const risk_V = form.watch("risk_V");
    const risk_D = form.watch("risk_D");

    // Check if any of the values are undefined
    if (risk_D === undefined || risk_E === undefined || risk_V === undefined) {
      return;
    }

    // Calculate global risk
    const risk_global = Math.round(risk_D * risk_E * risk_V * 100) / 100;
    form.setValue("risk_global", risk_global);
  }, [form, form.watch("risk_D"), form.watch("risk_E"), form.watch("risk_V")]);

  // check if has_pei
  useEffect(() => {
    const has_pei = form.watch("has_pei");
    setHasPei(!!has_pei);
  }, [form.watch("has_pei")]);

  return { hasPei, hasInfrastructures };
};

export default useDamRiskEffectsPT;
