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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LuCheck,
  LuChevronsUpDown,
  LuHelpCircle,
  LuLoader2,
  LuPencil,
  LuPencilLine,
} from "react-icons/lu";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/card";
import { usages, hydrologicalBasinPT } from "@/data/dam/constants";

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
  //TODO: include other features from other tables of db related to dams model
};

const onSubmit = (data: z.infer<typeof DamSchema>) => {
  //TODO
  //console.log(data);
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
  const [isCountryPT, setIsCountryPT] = useState(false); // to see if country is PRT

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries;

  const form = useForm<z.infer<typeof DamSchema>>({
    resolver: zodResolver(DamSchema),
    defaultValues: (dam || {
      name: "",
      class: DamClass.Unknown,
      material: DamMaterial.Other,
      profile: "",
      description: "",

      usages: [],

      //description: "",
      owner: "",
      promotor: "",
      builder: "",
      designer: "",
      project_year: "",
      completion_year: "",

      //localization
      country: "PT",
      state: "",
      city: "",
      local: "",
      hydro_basin: "",
      water_line: "",
      latitude: 0,
      longitude: 0,

      //HydroFeatures
      watershed_area: 0,
      average_annual_prec: 0,
      flood_flow: 0,
      average_annual_flow: 0,
      return_period: 0,

      //Reservoir Features
      flood_area: 0,
      total_capacity: 0,
      useful_capacity: 0,
      dead_volume: 0,
      fsl: 0,
      mfl: 0,
      mol: 0,

      // Dam Features
      height_to_foundation: 0,
      height_to_natural: 0,
      crest_elevation: 0,
      crest_length: 0,
      crest_width: 0,
      embankment_volume: 0,
      concrete_volume: 0,

      foundation_geology: "",
      foundation_treatment: "",

      //BottomDischarge
      has_btd: false,
      btd_local: "",
      btd_type: "",
      btd_number: 0,
      btd_section: "",
      btd_diameter: 0,
      btd_maxflow: 0,
      btd_upstream: "",
      btd_downstream: "",
      btd_energy: "",
      btd_more: "",

      //Spillway
      has_spillway: false,
      spillway_local: "",
      spillway_type: "",
      spillway_number: 0,
      spillway_floodgates: "",
      spillway_sill_elevation: 0,
      spillway_sill_length: 0,
      spillway_maxflow: 0,
      spillway_energy: "",
      spillway_more: "",

      //Hydroeletrical central
      has_hydropower: false,
      hp_local: "",
      hp_number_groups: 0,
      hp_groups_type: "",
      hp_power: 0,
      hp_annual_energy: 0,
      hp_more: "",

      //Environmental circuit
      has_environ_circuit: false,
      environ_local: "",
      environ_type_control: "",
      environ_max_flow: 0,
      environ_ref_flow: 0,
      environ_more: "",

      //Overall notes on dam
      notes: "",
    }) as z.infer<typeof DamSchema>,
  });

  const { watch, setValue } = form;

  const watchHasBottomDischarge = watch("has_btd", false);
  const watchHasSpillway = watch("has_spillway", false);
  const watchHasHydroPower = watch("has_hydropower", false);
  const watchHasEnviron = watch("has_environ_circuit", false);

  useEffect(() => {
    if (watchHasBottomDischarge === false) {
      setValue("btd_local", "");
      setValue("btd_type", "");
      setValue("btd_number", 0);
      setValue("btd_section", "");
      setValue("btd_diameter", 0);
      setValue("btd_maxflow", 0);
      setValue("btd_upstream", "");
      setValue("btd_downstream", "");
      setValue("btd_energy", "");
      setValue("btd_more", "");
    } else {
      setValue("btd_number", 1);
    }
  }, [watchHasBottomDischarge, setValue]);

  useEffect(() => {
    if (watchHasSpillway === false) {
      setValue("spillway_local", "");
      setValue("spillway_type", "");
      setValue("spillway_number", 0);
      setValue("spillway_floodgates", "");
      setValue("spillway_sill_elevation", 0);
      setValue("spillway_sill_length", 0);
      setValue("spillway_maxflow", 0);
      setValue("spillway_energy", "");
      setValue("spillway_more", "");
    } else {
      setValue("spillway_number", 1);
    }
  }, [watchHasSpillway, setValue]);

  useEffect(() => {
    if (watchHasHydroPower === false) {
      setValue("hp_local", "");
      setValue("hp_number_groups", 0);
      setValue("hp_groups_type", "");
      setValue("hp_power", 0);
      setValue("hp_annual_energy", 0);
      setValue("hp_more", "");
    } else {
      setValue("hp_number_groups", 1);
    }
  }, [watchHasHydroPower, setValue]);

  useEffect(() => {
    if (watchHasEnviron === false) {
      setValue("environ_local", "");
      setValue("environ_type_control", "");
      setValue("environ_max_flow", 0);
      setValue("environ_ref_flow", 0);
      setValue("environ_more", "");
    }
  }, [watchHasEnviron, setValue]);

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

  useEffect(() => {
    const selectedCountry = form.watch("country");
    if (selectedCountry === "PT") {
      setIsCountryPT(true);
    } else {
      setIsCountryPT(false);
      form.setValue("hydro_basin", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("country")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-8">
          <div className="flex w-full flex-col items-stretch justify-center gap-6 sm:flex-row sm:flex-wrap">
            {/* General data */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      1
                    </div>
                    <div className="text-yellow-500">
                      General identification
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Overall data</CardDescription>
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
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* Risk SClass of dam */}
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <div className="flex flex-col gap-2.5 py-2">
                          <FormLabel>Class*</FormLabel>
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
                          <FormLabel>Material*</FormLabel>
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
                        <FormLabel>Profile/structure type</FormLabel>
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
                        <Textarea {...field} />
                      </FormControl>

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Usages */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      2
                    </div>
                    <div className="text-yellow-500">Purpose</div>
                  </div>
                </CardTitle>
                <CardDescription>Select the dam usages*</CardDescription>
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
                      <FormMessage className="py-2 text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Project and construction info */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      3
                    </div>
                    <div className="text-yellow-500">
                      Project and construction
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Entities and relevant dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full grid-cols-2 gap-4">
                  {/* Owner */}
                  <FormField
                    control={form.control}
                    name="owner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dam owner*</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>Dam promotor</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>Building company</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>Designer company</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>Project year*</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>Completion year*</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      4
                    </div>
                    <div className="text-yellow-500">Location</div>
                  </div>
                </CardTitle>
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
                                  defaultValue="PT"
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
                      <FormItem>
                        <FormLabel>Locality </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>Hydrological basin</FormLabel>

                        {!isCountryPT ? (
                          <FormControl>
                            <Input
                              className="w-full rounded border text-base"
                              {...field}
                            />
                          </FormControl>
                        ) : (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Hydro Basins</SelectLabel>
                                {hydrologicalBasinPT.map((basin) => (
                                  <SelectItem
                                    key={basin}
                                    value={basin.toLowerCase()}
                                  >
                                    {basin}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="water_line"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stream</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FormLabel className="inline-flex gap-2">
                                Latitude <LuHelpCircle />
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Decimal degrees (DD) -90 to 90</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FormLabel className="inline-flex gap-2">
                                Longitude <LuHelpCircle />
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Decimal degrees (DD) -180 to 180</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>{" "}
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      5
                    </div>
                    <div className="text-yellow-500">Hydrological data</div>
                  </div>
                </CardTitle>
                <CardDescription>Main hydrologic parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full grid-cols-2 items-end gap-4">
                  <FormField
                    control={form.control}
                    name="watershed_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Watershed area (km<sup>2</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FormLabel className="inline-flex gap-2">
                                Precipitation (mm/yr) <LuHelpCircle />
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Average annual precipitation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>
                          Flood flow (m<sup>3</sup>/s)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
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
                      <FormItem>
                        <FormLabel>Return period (yrs)</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      6
                    </div>
                    <div className="text-yellow-500">Reservoir data</div>
                  </div>
                </CardTitle>
                <CardDescription>Main hydraulic parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="flood_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Flooded area at FSL (m<sup>2</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>
                          Total capacity (m<sup>3</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>
                          Useful capacity (m<sup>3</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>
                          Dead volume (m<sup>3</sup>)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <CardTitle className="pb-2 pt-4 text-sm font-semibold">
                  Notable levels (m)
                </CardTitle>

                <div className="grid w-full grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="fsl"
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem>
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
                      <FormItem>
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
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      7
                    </div>
                    <div className="text-yellow-500">Dam body</div>
                  </div>
                </CardTitle>
                <CardDescription>Geometrical data</CardDescription>
              </CardHeader>
              <CardContent>
                <CardTitle className="pb-2 text-sm font-semibold">
                  Heigth (m)
                </CardTitle>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height_to_foundation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Above foundation</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>Above natural ground</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <CardTitle className="pb-2 pt-4 text-sm font-semibold">
                  Crest parameters (m)
                </CardTitle>
                <div className="grid w-full grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="crest_elevation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Elevation</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="crest_length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <CardTitle className="pb-2 pt-4 text-sm font-semibold">
                  Volume of building materials (m<sup>3</sup>)
                </CardTitle>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="embankment_volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Embankments</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
                      <FormItem>
                        <FormLabel>Concrete</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded border text-base"
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
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      8
                    </div>
                    <div className="text-yellow-500">Foundation</div>
                  </div>
                </CardTitle>
                <CardDescription>Geology and treatment </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full space-y-4">
                  <FormField
                    control={form.control}
                    name="foundation_geology"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Geology of region/local</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="h-32" />
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
                          <Textarea {...field} className="h-32" />
                        </FormControl>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bottom discharge */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      9
                    </div>
                    <div className="text-yellow-500">Bottom discharge</div>
                  </div>
                </CardTitle>
                <CardDescription>
                  Description of hydraulic circuit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full space-y-4">
                  <FormField
                    control={form.control}
                    name="has_btd"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-3 pb-3">
                        <div className="space-y-0.5">
                          <FormLabel>Bottom discharge circuit?</FormLabel>
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

                  {watchHasBottomDischarge && (
                    <div className="grid gap-4">
                      <div className="grid w-full grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="btd_local"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Localization</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>Type of discharge</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>Number of conduits</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>Type of section</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>Diameter (mm)</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>
                                Maximum flow (m<sup>3</sup>/s)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                          <FormItem>
                            <FormLabel>Upstream control</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full rounded border text-base"
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
                          <FormItem>
                            <FormLabel>Downstream control</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full rounded border text-base"
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
                          <FormItem>
                            <FormLabel>Energy dissipation</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full rounded border text-base"
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
                              <Textarea {...field} />
                            </FormControl>

                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Spillway */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      10
                    </div>
                    <div className="text-yellow-500">Spillway</div>
                  </div>
                </CardTitle>{" "}
                <CardDescription>
                  Description of hydraulic features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full space-y-4">
                  <FormField
                    control={form.control}
                    name="has_spillway"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-3 pb-3">
                        <div className="space-y-0.5">
                          <FormLabel>Spillway?</FormLabel>
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

                  {watchHasSpillway && (
                    <div className="grid gap-4">
                      <div className="grid w-full grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="spillway_local"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Localization</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>Type of discharge</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>Number of channels</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>Flood gates</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>Sill elevation (m)</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                            <FormItem>
                              <FormLabel>Sill length (m)</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                          <FormItem>
                            <FormLabel>
                              Maximum flow discharge (m<sup>3</sup>/s)
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="w-full rounded border text-base"
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
                          <FormItem>
                            <FormLabel>Energy dissipation type</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full rounded border text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="spillway_more"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>More info</FormLabel>
                            <FormControl>
                              <Textarea className="h-36" {...field} />
                            </FormControl>

                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hydropower plant */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      11
                    </div>
                    <div className="text-yellow-500">Hydropower</div>
                  </div>
                </CardTitle>{" "}
                <CardDescription>
                  Hydroeletric power plant features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full space-y-4">
                  <FormField
                    control={form.control}
                    name="has_hydropower"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-3 pb-3">
                        <div className="space-y-0.5">
                          <FormLabel>Hydroeletric power plant?</FormLabel>
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
                  {watchHasHydroPower && (
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="hp_local"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Localization/Type</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full rounded border text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <div className="grid w-full grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="hp_number_groups"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of groups</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hp_groups_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Groups type</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                          name="hp_power"
                          render={({ field }) => (
                            <FormItem>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <FormLabel className="inline-flex items-center justify-start gap-2">
                                      <div>Power (MW)</div>
                                      <LuHelpCircle />
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Total power installed</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>{" "}
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hp_annual_energy"
                          render={({ field }) => (
                            <FormItem>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <FormLabel className="inline-flex items-center justify-start gap-2">
                                      <div>Energy (GWh/yr)</div>
                                      <LuHelpCircle />
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Produced in an average year</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                        name="hp_more"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>More info</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>

                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Environmental flow */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      12
                    </div>
                    <div className="text-yellow-500">Environmental flow</div>
                  </div>
                </CardTitle>
                <CardDescription>Main features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full space-y-4">
                  <FormField
                    control={form.control}
                    name="has_environ_circuit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-3 pb-3">
                        <div className="space-y-0.5">
                          <FormLabel>Environmental flow circuit?</FormLabel>
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

                  {watchHasEnviron && (
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="environ_local"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Circuit location</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full rounded border text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="environ_type_control"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type of control</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full rounded border text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <div className="grid w-full grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="environ_max_flow"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Maximum flow (m<sup>3</sup>/s)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="environ_ref_flow"
                          render={({ field }) => (
                            <FormItem>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <FormLabel className="inline-flex items-center justify-start gap-2">
                                      <div>
                                        Reference flow (m<sup>3</sup>/s)
                                      </div>
                                      <LuHelpCircle />
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Referenced to Minimum Operational Level
                                      (MOL)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <FormControl>
                                <Input
                                  className="w-full rounded border text-base"
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
                        name="environ_more"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>More info</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>

                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional notes */}
            <Card className="w-[400px] drop-shadow-lg lg:w-[826px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      13
                    </div>
                    <div className="text-yellow-500">
                      Final remarks on the dam
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
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
                      <LuLoader2 className="mr-2 h-4 w-4 animate-spin-slow" />
                      Updating
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
                      <LuLoader2 className="mr-2 h-4 w-4 animate-spin-slow" />
                      Creating
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
