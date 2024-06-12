"use client";

import { DamSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dam, DamMaterial, DamClass, File } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  LuCheck,
  LuChevronsUpDown,
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
  files: File[];
  //TODO: include other features from other tables of db
};

const onSubmit = (data: z.infer<typeof DamSchema>) => {
  //TODO
  console.log("test");
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="flex flex-col items-start justify-center space-y-6">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full rounded border text-base"
                        placeholder=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2.5 py-2">
                      <FormLabel>Class</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[150px] justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? damClassArray.find(
                                    (damClassArray) =>
                                      damClassArray.value === field.value,
                                  )?.label
                                : "Select class"}
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
                                  {damClassArray.map((damClassArray, index) => (
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
                                          damClassArray.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {damClassArray.label}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverClose>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <div className="flex flex-col gap-2.5 py-2">
                      <FormLabel className="">Material</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[150px] justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? damMaterialArray.find(
                                    (damMaterialArray) =>
                                      damMaterialArray.value === field.value,
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
                              <CommandEmpty>No Material found.</CommandEmpty>
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

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="structure"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="">Structure type</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full rounded border text-base"
                        placeholder="e.g. Arch, rockfill,..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" className="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usage"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="">Dam usage</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full rounded border text-base"
                        placeholder="e.g. watersupply, irrigation,..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Localization*/}
              <div className="flex flex-1 flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Country</FormLabel>
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
                                placeholder="Select a country"
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

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select District</FormLabel>
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
                                placeholder="Select a district"
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

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Town</FormLabel>
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
                                placeholder="Select a city"
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

                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="hydro_basin"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="">Hydrological Basin</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full rounded border text-base"
                        placeholder="e.g. Douro, Tamega, ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
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
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="watershed_area"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="">
                      Watershed Area (km<sup>2</sup>)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full rounded border text-base"
                        placeholder=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="average_annual_prec"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Annual Average Precipitation (mm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flood_flow"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Flood Flow (m<sup>3</sup>/s)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="average_annual_flow"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Average annual total flow (m<sup>3</sup>)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="return_period"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Return Period (years)</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_capacity"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Total Capacity (m<sup>3</sup>)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fsl"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Full Storage Level (FSL) (m)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mfl"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Maximum Flood Level (MFL) (m)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mol"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Minimum Operation Level (MOL) (m)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height_to_fundation"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Height above foundation (m)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height_to_natural"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Height above natural ground level (m)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crest_elevation"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Crest Elevation (m)</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crest_lenght"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Crest Length (m)</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crest_width"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Crest Width (m)</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="embankment_volume"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Embankment volume (m<sup>3</sup>)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="concrete_volume"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    Concrete volume (m<sup>3</sup>)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="foundation_type"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Foundation description</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded border text-base"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap justify-between gap-2">
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
        </form>
      </Form>
    </div>
  );
}
