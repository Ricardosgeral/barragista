"use client";

import { DamLocationSchema } from "@/schemas/dam-schema";
import { DamLocation } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LuEye,
  LuHelpCircle,
  LuLoader2,
  LuPencil,
  LuPencilLine,
  LuRefreshCcw,
  LuSave,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "@/components/ui/use-toast";
import { startTransition, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

import { createDamFeature } from "@/actions/dam/create-dam-features";
import { updateDamFeature } from "@/actions/dam/update-dam-features";
import { deleteDamFeature } from "@/actions/dam/delete-dam-feature";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hydrologicalBasinPT } from "@/data/dam/constants";
import { ICity, IState } from "country-state-city";
import useLocation from "@/hooks/use-location";

import { parseCookies } from "nookies";
import { damFormSteps } from "@/data/dam/constants";

const location = damFormSteps.sidebarNav[1];

interface AddDamLocationFormProps {
  damId: string | null;
  damLocation: DamLocation | null; //if null will create
}

export default function AddDamLocationForm({
  damId,
  damLocation,
}: AddDamLocationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [isCountryPT, setIsCountryPT] = useState(false); // to see if country is PRT
  const { getAllCountries, getCountryStates, getStateCities } = useLocation();

  const cookies = parseCookies();
  const serializedDamLocationInfo = cookies.damLocationInfo;

  let damLocationInfo: AddDamLocationFormProps | null = null;

  if (serializedDamLocationInfo) {
    damLocationInfo = JSON.parse(serializedDamLocationInfo);
  }

  const countries = getAllCountries;

  const form = useForm<z.infer<typeof DamLocationSchema>>({
    resolver: zodResolver(DamLocationSchema),
    defaultValues: (damLocation || {
      //Location
      country: "PT",
      state: "",
      city: "",
      local: "",
      hydro_basin: "",
      water_line: "",
      latitude: 0,
      longitude: 0,
    }) as z.infer<typeof DamLocationSchema>,
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

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof DamLocationSchema>) => {
    setIsLoading(true);
    if (damLocation && damId) {
      // update the dam location with a given ID
      startTransition(() => {
        setIsLoading(true);
        updateDamFeature("location", values, damId)
          .then((data) => {
            if (!data.ok) {
              toast({
                variant: "destructive",
                description: `Something went wrong! ${data.message}`,
              });
            } else {
              toast({
                variant: "success",
                description: `Success: ${data.message}`,
              });
              router.push(`/dam/${damId}${location.path}`);
            }
          })
          .finally(() => setIsLoading(false));
      });
    } else {
      // create (use of the server action... Could alse be done with API.)
      if (damId) {
        startTransition(() => {
          setIsLoading(true);
          createDamFeature("location", values, damId)
            .then((data) => {
              if (!data.ok) {
                toast({
                  variant: "destructive",
                  description: `Error: ${data.message}`,
                });
              } else {
                toast({
                  variant: "success",
                  description: `Success: ${data.message}`,
                });
                router.push(`/dam/${damId}${location.path}`);
              }
            })

            .finally(() => setIsLoading(false));
        });
      }
    }
  };

  const handleDelete = (damId: string, damLocation: DamLocation) => {
    if (damId && damLocation) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDeleting(true);
        deleteDamFeature("location", damId)
          .then((data) => {
            if (!data.ok) {
              toast({
                variant: "destructive",
                description: `Something went wrong! ${data.message}`,
              });
            } else {
              toast({
                variant: "success",
                description: `Success: ${data.message}`,
              });
              form.reset(); // reset the form
              router.push(`/dam/${damId}${location.path}`);
            }
          })
          .finally(() => setIsDeleting(true));
      });
    }
  };

  const handleResetform = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="flex w-full flex-col items-stretch justify-center gap-6 sm:flex-row sm:flex-wrap">
            {/* Location*/}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      {location.id}
                    </div>
                    <div className="text-yellow-500">
                      {location.description}
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>{location.subtext}</CardDescription>
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
                        <FormLabel>Town</FormLabel>
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
                                    key={basin.toLowerCase()}
                                    value={basin}
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
                        <FormLabel>Tributary stream</FormLabel>
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
                                Latitude* <LuHelpCircle />
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
                                Longitude* <LuHelpCircle />
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
          </div>

          <div className="flex w-full items-center lg:w-1/2">
            <div className="flex w-full items-center justify-around">
              <div className="flex justify-start gap-4">
                {/* delete Button */}
                {damId && damLocation && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        type="button"
                        disabled={isDeleting || isLoading}
                      >
                        {isDeleting ? (
                          <>
                            <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting
                          </>
                        ) : (
                          <>
                            <LuTrash2 className="mr-2 h-4 w-4" /> Delete
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. <br />
                          This will permanently remove the dam data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(damId, damLocation)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {/* reset form button */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => handleResetform()}
                >
                  <LuRefreshCcw className="mr-2" />
                  Reset
                </Button>
              </div>

              <div className="flex justify-end gap-4">
                {/* view Dam button */}

                {damId && damLocation && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        router.push(`/dam-details/${damId}`);
                      }}
                    >
                      <LuEye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </>
                )}

                {/* create/update Dam Buttons */}
                {damId && damLocation ? (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="max-w-[150px]"
                    variant="primary"
                  >
                    {isLoading ? (
                      <>
                        <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
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
                        <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating
                      </>
                    ) : (
                      <>
                        <LuSave className="mr-2 h-4 w-4" /> Save
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
