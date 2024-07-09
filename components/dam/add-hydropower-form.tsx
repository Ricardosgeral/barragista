"use client";

import { DamHydropowerSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamHydropower } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { LuHelpCircle } from "react-icons/lu";

import { startTransition, useEffect, useState } from "react";

import { createDamFeature } from "@/actions/dam/create-dam-features";
import { updateDamFeature } from "@/actions/dam/update-dam-features";
import { deleteDamFeature } from "@/actions/dam/delete-dam-feature";

import { useRouter } from "next/navigation";

import { damFormSteps } from "@/data/dam/constants";
import DamFormButtons from "@/components/dam/dam-form-buttons";

const hydropower = damFormSteps.sidebarNav[9];

interface AddDamHydropowerFormProps {
  damId: string | null;
  damHydropower: DamHydropower | null; //if null will create a dam
}

export default function AddDamHydropowerForm({
  damId,
  damHydropower,
}: AddDamHydropowerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof DamHydropowerSchema>) => {
    setIsLoading(true);
    if (damHydropower && damId) {
      // update  with a given dam ID
      startTransition(() => {
        setIsLoading(true);
        setIsDeleting(false);

        updateDamFeature("hydropower", values, damId)
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
              router.push(`/dam/${damId}${hydropower.path}`);
            }
          })
          .finally(() => setIsLoading(false));
      });
    } else {
      // create (use of the server action... Could alse be done with API.)
      if (damId) {
        startTransition(() => {
          setIsLoading(true);
          setIsDeleting(false);

          createDamFeature("hydropower", values, damId)
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
                router.push(`/dam/${damId}${hydropower.path}`);
              }
            })

            .finally(() => setIsLoading(false));
        });
      }
    }
  };

  const handleDelete = (damId: string, damHydropower: DamHydropower) => {
    if (damId && damHydropower) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDeleting(true);
        deleteDamFeature("hydropower", damId)
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
              router.push(`/dam/${damId}${hydropower.path}`);
            }
          })
          .finally(() => setIsDeleting(true));
      });
    }
  };

  const handleResetform = () => {
    form.reset();
  };

  const form = useForm<z.infer<typeof DamHydropowerSchema>>({
    resolver: zodResolver(DamHydropowerSchema),
    defaultValues: (damHydropower || {
      //Hydropower
      has_hydropower: false,
      hp_local: "",
      hp_number_groups: 0,
      hp_groups_type: "",
      hp_power: 0,
      hp_annual_energy: 0,
      hp_more: "",
    }) as z.infer<typeof DamHydropowerSchema>,
  });

  const { watch, setValue } = form;

  const watchHasHydropower = watch("has_hydropower");

  useEffect(() => {
    if (watchHasHydropower === false) {
      setValue("hp_local", "");
      setValue("hp_number_groups", 0);
      setValue("hp_groups_type", "");
      setValue("hp_power", 0);
      setValue("hp_annual_energy", 0);
      setValue("hp_more", "");
    } else {
      setValue("hp_number_groups", 1);
    }
  }, [watchHasHydropower, setValue]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="space-y-4">
            {/* Hydropower plant */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      {hydropower.id}
                    </div>
                    <div className="text-yellow-500">
                      {hydropower.description}
                    </div>
                  </div>
                </CardTitle>{" "}
                <CardDescription>{hydropower.subtext}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full space-y-4">
                  <FormField
                    control={form.control}
                    name="has_hydropower"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-3 pb-3">
                        <div className="space-y-0.5">
                          <FormLabel>Hydroeletric dam?</FormLabel>
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
                  {watchHasHydropower && (
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

            <DamFormButtons
              damId={damId}
              damFeature={damHydropower}
              isLoading={isLoading}
              isDeleting={isDeleting}
              handleDelete={handleDelete}
              handleResetform={handleResetform}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
