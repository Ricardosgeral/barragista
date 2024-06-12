import { DamClass, DamMaterial } from "@prisma/client";
import { z } from "zod";

export const DamSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Minimum of 3 caracters required" })
    .max(50, { message: "Max 50 caracters" }),
  class: z.nativeEnum(DamClass).optional(),
  material: z.nativeEnum(DamMaterial),
  structure: z.string().min(3).max(30).optional(),
  description: z
    .string()
    .min(15, { message: "At least 15 caracters!" })
    .max(150, { message: "Too much text!" })
    .optional(),
  usage: z.string().min(10).max(30, { message: "Too much text!" }).optional(),
  owner: z.string().min(3).max(30, { message: "Too much text!" }).optional(),
  promotor: z.string().min(3).max(30, { message: "Too much text!" }).optional(),
  builder: z.string().min(3).max(30, { message: "Too much text!" }).optional(),
  designer: z.string().min(3).max(30, { message: "Too much text!" }).optional(),
  project_year: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  completion_year: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  //localization
  country: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  local: z.string().min(2).optional(),
  hydro_basin: z.string().min(2).optional(),
  water_line: z.string().min(2).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  //HydroFeatures
  watershed_area: z.coerce.number().optional(),
  average_annual_prec: z.coerce.number().optional(),
  flood_flow: z.coerce.number().optional(),
  average_annual_flow: z.coerce.number().optional(),
  return_period: z.coerce.number().optional(),
  //Reservoir Features
  flood_area: z.coerce.number().optional(),
  total_capacity: z.coerce.number().optional(),
  useful_capacity: z.coerce.number().optional(),
  dead_volume: z.coerce.number().optional(),
  fsl: z.coerce.number().optional(),
  mfl: z.coerce.number().optional(),
  mol: z.coerce.number().optional(),
  // Dam Features
  height_to_fundation: z.coerce.number().optional(),
  height_to_natural: z.coerce.number().optional(),
  crest_elevation: z.coerce.number().optional(),
  crest_lenght: z.coerce.number().optional(),
  crest_width: z.coerce.number().optional(),
  embankment_volume: z.coerce.number().optional(),
  concrete_volume: z.coerce.number().optional(),
  foundation_type: z.string().min(2).max(50).optional(),

  notes: z.string().min(2).max(50).optional(),

  ecoFlow: z.boolean().optional(),
});
