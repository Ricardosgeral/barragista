"use client";

import { DamSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dam, DamMaterial, DamClass, DamFile } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  LuCheck,
  LuChevronsUpDown,
  LuHelpCircle,
  LuLoader2,
  LuPencil,
  LuPencilLine,
} from "react-icons/lu";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "../ui/textarea";
import useLocation from "@/hooks/use-location";
import { ICity, IState } from "country-state-city";
import { useEffect, useState } from "react";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

//to use the enum defined in dam.prisma
const damClassArray = Object.entries(DamClass).map(([key, value]) => ({
  label: key,
  value: value,
}));

//to use the enum defined in dam.prisma
const damMaterialArray = Object.entries(DamMaterial).map(([key, value]) => ({
  label: key,
  value: value,
}));

interface AddDamFormProps {
  dam: Dam | null; //if null will create a dam
}

export type DamWithAllFeatures = Dam & {
  files: DamFile[];
  //TODO: include other features from other tables of db
};
// Dam usages/purposes
const usages = [
  {
    id: "water",
    label: "Water supply",
  },
  {
    id: "hydroeletric",
    label: "Hydropower generation",
  },
  {
    id: "irrigation",
    label: "Irrigation",
  },
  {
    id: "flood",
    label: "Flood control",
  },
  {
    id: "recreational",
    label: "Recreational activities",
  },
  {
    id: "navigation",
    label: "Navigation",
  },
  {
    id: "envionmental",
    label: "Environmental control",
  },
  {
    id: "debris",
    label: "Debris control",
  },
  {
    id: "industrial",
    label: "Industrial",
  },
  {
    id: "aquaculture",
    label: "Aquaculture",
  },
  {
    id: "tailings",
    label: "Tailings retention",
  },
  {
    id: "groundwater",
    label: "Groundwater Recharge",
  },
  {
    id: "erosion",
    label: "Erosion control",
  },
  {
    id: "climate",
    label: "Climate regulation",
  },
] as const;

const onSubmit = (data: z.infer<typeof DamSchema>) => {
  //TODO
  toast({
    title: "You submitted the following values:",
    description: (
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
  });
};

export default function AddDamForm({ dam }: AddDamFormProps) {
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries;

  const form = useForm<z.infer<typeof DamSchema>>({
    resolver: zodResolver(DamSchema),
    defaultValues: (dam || {
      name: "",
      material: DamMaterial.Other,
      has_eco_circuit: false,
      profile: "",
      country: "",
      state: "",
      city: "",
      usages: [],
      has_btd: true,
      has_spillway: true,
      has_hydropower: true,
    }) as z.infer<typeof DamSchema>,
  });

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedState = form.watch("state");
    const stateCities = getStateCities(selectedCountry, selectedState);
    if (stateCities) {
      setCities(stateCities);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("country"), form.watch("state")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-8">
          <div className="flex w-full flex-col items-stretch justify-center gap-6 sm:flex-row sm:flex-wrap">
            {/* General data */}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Overall features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex w-full gap-4">
                  {/* Name of dam */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-2/3">
                        <FormLabel>Name*</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* Class of dam */}
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <div className="flex flex-col gap-2.5 py-2">
                          <FormLabel>Class</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? damClassArray.find(
                                        (damClassArray) =>
                                          damClassArray.value === field.value,
                                      )?.label
                                    : "Select"}
                                  <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[150px] p-0">
                              <PopoverClose asChild>
                                <Command>
                                  <CommandInput placeholder="Choose" />
                                  <CommandEmpty>No class found</CommandEmpty>
                                  <CommandGroup>
                                    <CommandList>
                                      {damClassArray.map(
                                        (damClassArray, index) => (
                                          <CommandItem
                                            value={damClassArray.label}
                                            key={index}
                                            onSelect={() => {
                                              form.setValue(
                                                "class",
                                                damClassArray.value,
                                              );
                                            }}
                                          >
                                            <LuCheck
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                damClassArray.value ===
                                                  field.value
                                                  ? "opacity-100"
                                                  : "opacity-0",
                                              )}
                                            />
                                            {damClassArray.label}
                                          </CommandItem>
                                        ),
                                      )}
                                    </CommandList>
                                  </CommandGroup>
                                </Command>
                              </PopoverClose>
                            </PopoverContent>
                          </Popover>

                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full gap-4">
                  {/* Material of dam */}
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem className="flex w-1/3 flex-col">
                        <div className="flex flex-col gap-2.5 py-2">
                          <FormLabel className="">Material*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? damMaterialArray.find(
                                        (damMaterialArray) =>
                                          damMaterialArray.value ===
                                          field.value,
                                      )?.label
                                    : "Select"}
                                  <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[150px] p-0">
                              <PopoverClose asChild>
                                <Command>
                                  <CommandInput placeholder="Choose" />
                                  <CommandEmpty>
                                    No Material found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    <CommandList>
                                      {damMaterialArray.map(
                                        (damMaterialArray, index) => (
                                          <CommandItem
                                            value={damMaterialArray.label}
                                            key={index}
                                            onSelect={() => {
                                              form.setValue(
                                                "material",
                                                damMaterialArray.value,
                                              );
                                            }}
                                          >
                                            <LuCheck
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                damMaterialArray.value ===
                                                  field.value
                                                  ? "opacity-100"
                                                  : "opacity-0",
                                              )}
                                            />
                                            {damMaterialArray.label}
                                          </CommandItem>
                                        ),
                                      )}
                                    </CommandList>
                                  </CommandGroup>
                                </Command>
                              </PopoverClose>
                            </PopoverContent>
                          </Popover>

                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Structure type */}
                  <FormField
                    control={form.control}
                    name="profile"
                    render={({ field }) => (
                      <FormItem className="w-2/3">
                        <FormLabel>Structure type</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder="e.g. Arch, Zoned,..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} className="" />
                      </FormControl>

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Usages */}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle>Usages*</CardTitle>
                <CardDescription>Select the dam purposes</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="usages"
                  render={() => (
                    <FormItem className="w-full">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Add grid container */}
                        {usages.map((usage) => (
                          <FormField
                            key={usage.id}
                            control={form.control}
                            name="usages"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={usage.id}
                                  className="flex flex-row items-center justify-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(usage.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              usage.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== usage.id,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {usage.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Project and construction info */}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle>Dam project and construction</CardTitle>
                <CardDescription>Entities and relevant dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full grid-cols-2 gap-4">
                  {/* Owner */}
                  <FormField
                    control={form.control}
                    name="owner"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Dam owner</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* Promotor */}
                  <FormField
                    control={form.control}
                    name="promotor"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Dam promotor</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* Building company */}
                  <FormField
                    control={form.control}
                    name="builder"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Building company</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* Designing company */}
                  <FormField
                    control={form.control}
                    name="designer"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Designer company</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* project year */}
                  <FormField
                    control={form.control}
                    name="project_year"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Project year</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* Compleation year */}
                  <FormField
                    control={form.control}
                    name="completion_year"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Completion year</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Localization*/}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle>Dam location</CardTitle>
                <CardDescription>Geographical information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => {
                              return (
                                <SelectItem
                                  key={country.isoCode}
                                  value={country.isoCode}
                                  defaultValue="PRT"
                                >
                                  {country.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled={isLoading || states.length < 1}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => {
                              return (
                                <SelectItem
                                  key={state.isoCode}
                                  value={state.isoCode}
                                >
                                  {state.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Town*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled={isLoading || cities.length < 1}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => {
                              return (
                                <SelectItem key={city.name} value={city.name}>
                                  {city.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="local"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Locality </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hydro_basin"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Hydrological Basin</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder="e.g. Douro, ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="water_line"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Watercourse</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Latitude</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Longitude</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* hydrological features*/}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle>Hydrological features</CardTitle>
                <CardDescription>Main characteristics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full grid-cols-2 items-end gap-4">
                  <FormField
                    control={form.control}
                    name="watershed_area"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">
                          Watershed area (km<sup>2</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="average_annual_prec"
                    render={({ field }) => (
                      <FormItem className="">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FormLabel className="inline-flex gap-2">
                                Precipitation (mm/yr) <LuHelpCircle />
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Average anual precipitation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="flood_flow"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">
                          Flood flow (m<sup>3</sup>/s)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="average_annual_flow"
                    render={({ field }) => (
                      <FormItem className="">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FormLabel className="inline-flex">
                                Total flow (m<sup>3</sup>/yr){" "}
                                <LuHelpCircle className="ml-2" />
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Average annual total flow</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="return_period"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Return period (yrs)</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reservoir features*/}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle>Reservoir features</CardTitle>
                <CardDescription>Main characteristics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="flood_area"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">
                          Flooded area at FSL (m<sup>2</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_capacity"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">
                          Total capacity (m<sup>3</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="useful_capacity"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">
                          Useful capacity (m<sup>3</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dead_volume"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">
                          Dead Volume (m<sup>3</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <CardTitle className="pb-2 pt-4 text-sm font-semibold">
                  Reservoir notable levels (m)
                </CardTitle>

                <div className="grid w-full grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="fsl"
                    render={({ field }) => (
                      <FormItem className="">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FormLabel className="inline-flex gap-2">
                                FSL <LuHelpCircle />
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Full Storage Level</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mfl"
                    render={({ field }) => (
                      <FormItem className="">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FormLabel className="inline-flex gap-2">
                                MFL <LuHelpCircle />
                              </FormLabel>{" "}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Maximum Flood Level</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mol"
                    render={({ field }) => (
                      <FormItem className="">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FormLabel className="inline-flex gap-2">
                                MWL <LuHelpCircle />
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Minimum Operational Level</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dam features*/}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle>Hydrological features</CardTitle>
                <CardDescription>Main characteristics(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <CardTitle className="pb-2 text-sm font-semibold">
                  Heigth (m)
                </CardTitle>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height_to_fundation"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Above foundation</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height_to_natural"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Above natural ground</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <CardTitle className="pb-2 pt-4 text-sm font-semibold">
                  Crest features (m)
                </CardTitle>
                <div className="grid w-full grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="crest_elevation"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Elevation</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="crest_lenght"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Length</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="crest_width"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Width</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <CardTitle className="pb-2 pt-4 text-sm font-semibold">
                  Volume of materials (m<sup>3</sup>)
                </CardTitle>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="embankment_volume"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Embankments</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="concrete_volume"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Concrete</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Foundation */}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle>Foundation </CardTitle>
                <CardDescription>Geology and treatment </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="foundation_geology"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Geology of region/local</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} className="h-32" />
                      </FormControl>

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="foundation_treatment"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Foundation treatment</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} className="h-32" />
                      </FormControl>

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Bottom discharge */}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle className="text-bold text-lg">
                  Bottom discharge
                </CardTitle>
                <CardDescription>
                  Description of hydraulic circuit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="has_btd"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-3 pb-3">
                      <div className="space-y-0.5">
                        <FormLabel>Has bottom discharge circuit?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="btd_local"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Localization</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="btd_type"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Type of discharge</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="btd_number"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Number of conduits</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="btd_section"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Type of section</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="btd_diameter"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">
                          Diameter of conduit(s) (mm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="btd_maxflow"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">
                          Maximum flow (m<sup>3</sup>/s)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="btd_upstream"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="">Upstream control</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full rounded border text-base"
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="btd_downstream"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="">Downstream control</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full rounded border text-base"
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="btd_energy"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="">Energy dissipation</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full rounded border text-base"
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="btd_more"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>More info</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Spillway */}
            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle className="text-bold text-lg">Spillway</CardTitle>
                <CardDescription>
                  Description of hydraulic features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="has_spillway"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-3 pb-3">
                      <div className="space-y-0.5">
                        <FormLabel>Has spillway?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="spillway_local"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Localization</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spillway_type"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Type of discharge</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="spillway_number"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Number of channels</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spillway_floodgates"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Flood gates</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="spillway_sill_elevation"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Sill elevation (m)</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spillway_sill_length"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="">Sill length (m)</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="spillway_maxflow"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="">Maximum discharge</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full rounded border text-base"
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spillway_energy"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="">Energy dissipation</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full rounded border text-base"
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="btd_more"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>More info</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional notes */}

            <Card className="w-full drop-shadow-lg sm:w-[480px]">
              <CardHeader>
                <CardTitle>Final remarks </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Additional notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          {/* submit button */}
          <div className="flex w-full items-center">
            <div className="flex w-full items-center justify-center gap-2">
              {dam ? (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="max-w-[150px]"
                >
                  {isLoading ? (
                    <>
                      <LuLoader2 className="mr-2 h-4 w-4" /> Updating
                    </>
                  ) : (
                    <>
                      <LuPencilLine className="mr-2 h-4 w-4" /> Update
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="max-w-[150px]"
                >
                  {isLoading ? (
                    <>
                      <LuLoader2 className="mr-2 h-4 w-4" /> Creating
                    </>
                  ) : (
                    <>
                      <LuPencil className="mr-2 h-4 w-4" /> Create Dam
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
