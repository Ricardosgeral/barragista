import { DamClass, DamMaterial } from "@prisma/client";
import { z } from "zod";

export const DamSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Minimum of 3 caracters required" })
    .max(30, { message: "Max 30 caracters" }),
  class: z.nativeEnum(DamClass).optional(),
  material: z.nativeEnum(DamMaterial),
  profile: z.string().min(3).max(30),
  description: z
    .string()
    .min(15, { message: "Minimum of 15 caracters required" })
    .max(150, { message: "Too much text!" })
    .optional(),

  usages: z
    .array(z.string())
    .min(1, { message: "You have to select at least one" }),

  owner: z
    .string()
    .min(3)
    .max(30, { message: "Maximum of 30 caracters" })
    .optional(),
  promotor: z
    .string()
    .min(3)
    .max(30, { message: "Maximum of 30 caracters" })
    .optional(),
  builder: z
    .string()
    .min(3)
    .max(30, { message: "Maximum of 30 caracters" })
    .optional(),
  designer: z
    .string()
    .min(3)
    .max(30, { message: "Maximum of 30 caracters" })
    .optional(),
  project_year: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  completion_year: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  //localization
  country: z.string(),
  state: z.string(),
  city: z.string(),
  local: z
    .string()
    .min(2)
    .max(30, { message: "Maximum of 30 caracters" })
    .optional(),
  hydro_basin: z.string().min(2).optional(),
  water_line: z.string().min(2).optional(),
  latitude: z.coerce.number().nonnegative().optional(),
  longitude: z.coerce.number().nonnegative().optional(),
  //HydroFeatures
  watershed_area: z.coerce.number().nonnegative().optional(),
  average_annual_prec: z.coerce.number().nonnegative().optional(),
  flood_flow: z.coerce.number().nonnegative().optional(),
  average_annual_flow: z.coerce.number().nonnegative().optional(),
  return_period: z.coerce.number().nonnegative().optional(),
  //Reservoir Features
  flood_area: z.coerce.number().nonnegative().optional(),
  total_capacity: z.coerce.number().nonnegative().optional(),
  useful_capacity: z.coerce.number().nonnegative().optional(),
  dead_volume: z.coerce.number().nonnegative().optional(),
  fsl: z.coerce.number().nonnegative().optional(),
  mfl: z.coerce.number().nonnegative().optional(),
  mol: z.coerce.number().nonnegative().optional(),
  // Dam Features
  height_to_fundation: z.coerce.number().nonnegative().optional(),
  height_to_natural: z.coerce.number().nonnegative().optional(),
  crest_elevation: z.coerce.number().nonnegative().optional(),
  crest_lenght: z.coerce.number().nonnegative().optional(),
  crest_width: z.coerce.number().nonnegative().optional(),
  embankment_volume: z.coerce.number().nonnegative().optional(),
  concrete_volume: z.coerce.number().nonnegative().optional(),

  //foundation and treatment
  foundation_geology: z.string().min(2).max(50).optional(),
  foundation_treatment: z.string().min(2).max(50).optional(),

  //BottomDischarge
  has_btd: z.boolean(),
  btd_number: z.coerce.number().nonnegative().optional(),
  btd_local: z.string().min(3).max(30).optional(),
  btd_type: z.string().min(3).max(30).optional(),
  btd_section: z.string().min(3).max(30).optional(),
  btd_diameter: z.coerce.number().nonnegative().optional(),
  btd_maxflow: z.coerce.number().nonnegative().optional(),
  btd_upstream: z.string().min(3).max(30).optional(),
  btd_downstream: z.string().min(3).max(30).optional(),
  btd_energy: z.string().min(3).max(30).optional(),
  btd_more: z.string().min(3).max(30).optional(),

  //Spillway
  has_spillway: z.boolean(),
  spillway_number: z.coerce.number().nonnegative().optional(),
  spillway_local: z.string().min(3).max(30).optional(),
  spillway_type: z.string().min(3).max(30).optional(),
  spillway_floodgates: z.string().min(3).max(30).optional(),
  spillway_sill_elevation: z.coerce.number().nonnegative().optional(),
  spillway_sill_length: z.coerce.number().nonnegative().optional(),
  spillway_maxflow: z.coerce.number().nonnegative().optional(),
  spillway_energy: z.string().min(3).max(30).optional(),
  spillway_more: z.string().min(3).max(30).optional(),

  //hydropower
  has_hydropower: z.boolean(),
  hp_local: z.string().optional(),
  hp_group_type: z.string().optional(),
  hp_power: z.coerce.number().nonnegative().optional(),
  hp_anual_energy: z.coerce.number().nonnegative().optional(),
  hp_more: z.string().min(3).max(30).optional(),

  // Ecological circuit
  has_eco_circuit: z.boolean(),
  ecocirc_flow: z.coerce.number().nonnegative().optional(),
  ecocirc_more: z.string().min(3).max(30).optional(),

  //Final Notes
  notes: z.string().min(2).max(50).optional(),
});
