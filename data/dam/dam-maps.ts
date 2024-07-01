import {
  DamLocationSchema,
  DamProjectSchema,
  DamHydrologytSchema,
  DamReservoirSchema,
  DamBodySchema,
  DamFoundationSchema,
  DamBtDischargeSchema,
  DamSpillwaySchema,
  DamEnvFlowSchema,
  DamHydropowerSchema,
  DamRiskSchema,
} from "@/schemas/dam-schema";

import { db } from "@/lib/db";

export const schemaMap = {
  location: DamLocationSchema,
  project: DamProjectSchema,
  hydrology: DamHydrologytSchema,
  reservoir: DamReservoirSchema,
  body: DamBodySchema,
  foundation: DamFoundationSchema,
  bottom_discharge: DamBtDischargeSchema,
  spillway: DamSpillwaySchema,
  ecological_flow: DamEnvFlowSchema,
  hydropower: DamHydropowerSchema,
  risk: DamRiskSchema,
};

export const dbMap = {
  location: db.damLocation,
  project: db.damProject,
  hydrology: db.damHydrology,
  reservoir: db.damReservoir,
  body: db.damBody,
  foundation: db.damFoundation,
  bottom_discharge: db.damBtDischarge,
  spillway: db.damSpillway,
  ecological_flow: db.damEnvFlow,
  hydropower: db.damHydropower,
  risk: db.damRisk,
};
