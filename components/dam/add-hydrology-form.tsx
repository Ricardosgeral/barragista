"use client";

import { DamHydrologySchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamHydrology } from "@prisma/client";
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

import { Input } from "@/components/ui/input";
import { LuHelpCircle } from "react-icons/lu";
import { toast } from "@/components/ui/use-toast";
import { startTransition, useState } from "react";
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

import { damFormSteps } from "@/data/dam/constants";
import DamFormButtons from "@/components/dam/dam-form-buttons";

const hydrology = damFormSteps.sidebarNav[3];

interface AddDamHydrologyFormProps {
  // dam: DamWithAllFeatures | null;
  damId: string | null;
  damHydrology: DamHydrology | null; //if null will create a dam
}

export default function AddDamHydrologyForm({
  damId,
  damHydrology,
}: AddDamHydrologyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof DamHydrologySchema>) => {
    setIsLoading(true);
    if (damHydrology && damId) {
      // update with a given dam ID
      startTransition(() => {
        setIsLoading(true);
        updateDamFeature("hydrology", values, damId)
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
              router.push(`/dam/${damId}${hydrology.path}`);
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

          createDamFeature("hydrology", values, damId)
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
                router.push(`/dam/${damId}/reservoir`);
              }
            })

            .finally(() => setIsLoading(false));
        });
      }
    }
  };

  const handleDelete = (damId: string, damHydrology: DamHydrology) => {
    if (damId && damHydrology) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDeleting(true);

        deleteDamFeature("hydrology", damId)
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
              router.push(`/dam/${damId}${hydrology.path}`);
            }
          })
          .finally(() => setIsDeleting(true));
      });
    }
  };

  const handleResetform = () => {
    form.reset();
  };

  const form = useForm<z.infer<typeof DamHydrologySchema>>({
    resolver: zodResolver(DamHydrologySchema),
    defaultValues: (damHydrology || {
      //HydroFeatures
      watershed_area: 0,
      average_annual_prec: 0,
      flood_flow: 0,
      average_annual_flow: 0,
      return_period: 0,
    }) as z.infer<typeof DamHydrologySchema>,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="space-y-4">
            {/* hydrological features*/}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      {hydrology.id}
                    </div>
                    <div className="text-yellow-500">
                      {hydrology.description}
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>{hydrology.subtext}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full grid-cols-2 items-end gap-4">
                  <FormField
                    control={form.control}
                    name="watershed_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Watershed area* (km<sup>2</sup>)
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
                            <TooltipTrigger asChild>
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
                            <TooltipTrigger asChild>
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
            <DamFormButtons
              damId={damId}
              damFeature={damHydrology}
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
