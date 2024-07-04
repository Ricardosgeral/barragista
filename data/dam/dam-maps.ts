import {
  DamLocationSchema,
  DamProjectSchema,
  DamHydrologySchema,
  DamReservoirSchema,
  DamBodySchema,
  DamFoundationSchema,
  DamDischargeSchema,
  DamSpillwaySchema,
  DamEnvironmentalSchema,
  DamHydropowerSchema,
  DamRiskSchema,
} from "@/schemas/dam-schema";

import { db } from "@/lib/db";

export const schemaMap = {
  location: DamLocationSchema,
  project: DamProjectSchema,
  hydrology: DamHydrologySchema,
  reservoir: DamReservoirSchema,
  body: DamBodySchema,
  foundation: DamFoundationSchema,
  discharge: DamDischargeSchema,
  spillway: DamSpillwaySchema,
  environmental: DamEnvironmentalSchema,
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
  discharge: db.damDischarge,
  spillway: db.damSpillway,
  environmental: db.damEnvironmental,
  hydropower: db.damHydropower,
  risk: db.damRisk,
};
