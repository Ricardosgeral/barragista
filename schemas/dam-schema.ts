import { DamClass, DamMaterial } from "@prisma/client";
import { z } from "zod";

export const DamSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum of 2 caracters required")
    .max(30, "Maximum of 30 caracters"),
  class: z.nativeEnum(DamClass),
  material: z.nativeEnum(DamMaterial),
  profile: z.string().min(3, "Minimum of 3 caracters required").max(30),
  description: z.string().max(150, "Maximum of 150 characters").optional(),

  usages: z.array(z.string()).min(1, "Select at least one"),

  owner: z
    .string()
    .min(2, "Minimum of 2 caracters required")
    .max(30, "Maximum of 30 caracters"),
  promotor: z.string().max(30, "Maximum of 30 caracters").optional(),
  builder: z.string().max(30, "Maximum of 30 caracters").optional(),
  designer: z.string().max(30, "Maximum of 30 caracters"),
  project_year: z.string().regex(/^\d{4}$/, "YYYY required"),
  completion_year: z.string().regex(/^\d{4}$/, "YYYY required"),
  //localization
  country: z.string(),
  state: z.string(),
  city: z.string().optional(),
  local: z.string().max(30, "Maximum of 30 caracters").optional(),
  hydro_basin: z.string().optional(),
  water_line: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
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
  height_to_foundation: z.coerce.number().nonnegative(),
  height_to_natural: z.coerce.number().nonnegative().optional(),
  crest_elevation: z.coerce.number().nonnegative(),
  crest_length: z.coerce.number().nonnegative(),
  crest_width: z.coerce.number().nonnegative().optional(),
  embankment_volume: z.coerce.number().nonnegative().optional(),
  concrete_volume: z.coerce.number().nonnegative().optional(),

  //foundation and treatment
  foundation_geology: z.string().max(60).optional(),
  foundation_treatment: z.string().max(60).optional(),

  //BottomDischarge
  has_btd: z.boolean(),
  btd_number: z.coerce.number().nonnegative().optional(),
  btd_local: z.string().max(30).optional(),
  btd_type: z.string().max(30).optional(),
  btd_section: z.string().max(30).optional(),
  btd_diameter: z.coerce.number().nonnegative().optional(),
  btd_maxflow: z.coerce.number().nonnegative().optional(),
  btd_upstream: z.string().max(30).optional(),
  btd_downstream: z.string().max(30).optional(),
  btd_energy: z.string().max(30).optional(),
  btd_more: z.string().max(60).optional(),

  //Spillway
  has_spillway: z.boolean(),
  spillway_number: z.coerce.number().nonnegative().optional(),
  spillway_local: z.string().max(30).optional(),
  spillway_type: z.string().max(30).optional(),
  spillway_floodgates: z.string().max(30).optional(),
  spillway_sill_elevation: z.coerce.number().nonnegative().optional(),
  spillway_sill_length: z.coerce.number().nonnegative().optional(),
  spillway_maxflow: z.coerce.number().nonnegative().optional(),
  spillway_energy: z.string().max(30).optional(),
  spillway_more: z.string().max(60).optional(),

  //hydropower
  has_hydropower: z.boolean(),
  hp_local: z.string().max(30).optional(),
  hp_number_groups: z.coerce.number().nonnegative().optional(),
  hp_groups_type: z.string().max(30).optional(),
  hp_power: z.coerce.number().nonnegative().optional(),
  hp_annual_energy: z.coerce.number().nonnegative().optional(),
  hp_more: z.string().max(60).optional(),

  // Ecological circuit
  has_environ_circuit: z.boolean(),
  environ_local: z.string().max(30).optional(),
  environ_type_control: z.string().max(30).optional(),
  environ_max_flow: z.coerce.number().nonnegative().optional(),
  environ_ref_flow: z.coerce.number().nonnegative().optional(),
  environ_more: z.string().max(30).optional(),

  //Final Notes
  notes: z.string().max(50).optional(),
});
