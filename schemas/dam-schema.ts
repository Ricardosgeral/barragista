import { DamClass, DamMaterial } from "@prisma/client";
import { z } from "zod";

export const DamSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum of 2 caracters")
    .max(50, "Maximum of 50 caracters"),
  material: z.nativeEnum(DamMaterial),
  profile: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(1, "Select at least one")
    .max(5),
  purpose: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(1, "Select at least one")
    .max(6),
  description: z.string().max(200, "Maximum of 150 characters").optional(),
  public: z.boolean(),
});

export const DamLocationSchema = z.object({
  //localization
  country: z.string(),
  state: z.string(),
  city: z.string().optional(),
  local: z.string().max(30, "Maximum of 30 caracters").optional(),
  hydro_basin: z.string().max(50).optional(),
  water_line: z.string().max(50).optional(),
  latitude: z.coerce
    .number({ message: "Latitude in DD required" })
    .min(-90)
    .max(90)
    .refine((value) => value !== 0, {
      message: "Number cannot be 0",
    }),
  longitude: z.coerce
    .number({ message: "Longitude in DD required" })
    .min(-180)
    .max(180)
    .refine((value) => value !== 0, {
      message: "Number cannot be 0",
    }),
});
export const DamProjectSchema = z.object({
  //Project construction
  owner: z
    .string()
    .min(2, "Minimum of 2 caracters")
    .max(30, "Maximum of 30 caracters"),
  promotor: z.string().max(30, "Maximum of 30 caracters").optional(),
  builder: z.string().max(30, "Maximum of 30 caracters").optional(),
  designer: z.string().max(30, "Maximum of 30 caracters"),
  project_year: z.string().regex(/^\d{4}$/, "YYYY format"),
  completion_year: z.string().regex(/^\d{4}$/, "YYYY format"),
  status: z.string(),
});

export const DamHydrologySchema = z.object({
  //HydroFeatures
  watershed_area: z.coerce.number().positive("Positive number required"),
  average_annual_prec: z.coerce.number().min(0).optional(),
  flood_flow: z.coerce.number().min(0).optional(),
  average_annual_flow: z.coerce.number().min(0).optional(),
  return_period: z.coerce.number().min(0).optional(),
});
export const DamReservoirSchema = z.object({
  //Reservoir Features
  flood_area: z.coerce.number().positive("Positive number required"),
  total_capacity: z.coerce.number().positive("Positive number required"),
  reservoir_length: z.coerce.number().min(0).optional(),
  useful_capacity: z.coerce.number().min(0).optional(),
  dead_volume: z.coerce.number().min(0).optional(),
  fsl: z.coerce.number().min(0).optional(),
  mfl: z.coerce.number().min(0).optional(),
  mol: z.coerce.number().min(0).optional(),
});
export const DamBodySchema = z.object({
  // Dam Body
  height_to_foundation: z.coerce.number().positive("Positive number required"),
  height_to_natural: z.coerce.number().min(0).optional(),
  crest_elevation: z.coerce.number().min(0),
  crest_length: z.coerce.number().min(0),
  crest_width: z.coerce.number().min(0).optional(),
  embankment_volume: z.coerce.number().min(0).optional(),
  concrete_volume: z.coerce.number().min(0).optional(),
});
export const DamFoundationSchema = z.object({
  //foundation and treatment
  foundation_type: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(1, "Select at least one")
    .max(3),
  foundation_geology: z.string().max(200).optional(),
  foundation_treatment: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(1, "Select at least one")
    .max(5),
  foundation_notes: z.string().max(200).optional(),
});
export const DamDischargeSchema = z.object({
  //BottomDischarge
  has_btd: z.boolean(),
  btd_number: z.coerce.number().min(0).optional(),
  btd_local: z.string().max(60).optional(),
  btd_type: z.string().max(60).optional(),
  btd_section: z.string().max(60).optional(),
  btd_diameter: z.coerce.number().min(0).optional(),
  btd_maxflow: z.coerce.number().min(0).optional(),
  btd_upstream: z.string().max(60).optional(),
  btd_downstream: z.string().max(60).optional(),
  btd_energy: z.string().max(60).optional(),
  btd_more: z.string().max(100).optional(),
});
export const DamSpillwaySchema = z.object({
  //Spillway
  has_spillway: z.boolean(),
  spillway_number: z.coerce.number().min(0).optional(),
  spillway_local: z.string().max(30).optional(),
  spillway_type: z.string().max(30).optional(),
  spillway_floodgates: z.string().max(30).optional(),
  spillway_sill_elevation: z.coerce.number().min(0).optional(),
  spillway_sill_length: z.coerce.number().min(0).optional(),
  spillway_maxflow: z.coerce.number().min(0).optional(),
  spillway_energy: z.string().max(30).optional(),
  spillway_more: z.string().max(100).optional(),
});

export const DamEnvironmentalSchema = z.object({
  // Ecological circuit
  has_environ_circuit: z.boolean(),
  environ_local: z.string().max(30).optional(),
  environ_type_control: z.string().max(30).optional(),
  environ_max_flow: z.coerce.number().min(0).optional(),
  environ_ref_flow: z.coerce.number().min(0).optional(),
  environ_more: z.string().max(50).optional(),
});

export const DamHydropowerSchema = z.object({
  //hydropower
  has_hydropower: z.boolean(),
  hp_local: z.string().max(30).optional(),
  hp_number_groups: z.coerce.number().min(0).optional(),
  hp_groups_type: z.string().max(30).optional(),
  hp_power: z.coerce.number().min(0).optional(),
  hp_annual_energy: z.coerce.number().min(0).optional(),
  hp_more: z.string().max(100).optional(),
});

export const DamRiskSchema = z.object({
  // risk managment
  class: z.nativeEnum(DamClass),
  persons_downstream: z.coerce.number().int().min(0).optional(),
  houses_downstream: z.coerce.number().int().min(0).optional(),
  has_infrastructures: z.boolean().optional(),
  infrastructures: z.string().max(50).optional(),
  has_pei: z.boolean().optional(),
  pei: z.string().max(50).optional(),
  hazard_factor_X: z.coerce.number().min(0).optional(),
  sismicity: z.coerce.number().int().min(0).max(6).optional(),
  geo_conditions: z.coerce.number().int().min(0).max(6).optional(),
  design_flow: z.coerce.number().int().min(0).max(6).optional(),
  reservoir_management: z.coerce.number().int().min(0).max(6).optional(),
  env_harshness: z.coerce.number().int().min(0).max(6).optional(),
  project_construction: z.coerce.number().int().min(0).max(6).optional(),
  foundations: z.coerce.number().int().min(0).max(6).optional(),
  discharge_structures: z.coerce.number().int().min(0).max(6).optional(),
  maintenance: z.coerce.number().int().min(0).max(6).optional(),
  risk_E: z.coerce.number().min(0).optional(),
  risk_V: z.coerce.number().min(0).optional(),
  risk_D: z.coerce.number().min(0).optional(),
  risk_global: z.coerce.number().min(0).optional(),
});
