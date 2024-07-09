"use client";

import { DamReservoirSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamReservoir } from "@prisma/client";
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

const reservoir = damFormSteps.sidebarNav[4];

interface AddDamReservoirFormProps {
  damId: string | null;
  damReservoir: DamReservoir | null; //if null will create a dam
}

export default function AddDamReservoirForm({
  damId,
  damReservoir,
}: AddDamReservoirFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof DamReservoirSchema>) => {
    setIsLoading(true);
    if (damReservoir && damId) {
      // update  with a given dam ID
      startTransition(() => {
        setIsLoading(true);
        setIsDeleting(false);

        updateDamFeature("reservoir", values, damId)
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
              router.push(`/dam/${damId}${reservoir.path}`);
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

          createDamFeature("reservoir", values, damId)
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
                router.push(`/dam/${damId}${reservoir.path}`);
              }
            })

            .finally(() => setIsLoading(false));
        });
      }
    }
  };

  const handleDelete = (damId: string, damReservoir: DamReservoir) => {
    if (damId && damReservoir) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDeleting(true);
        deleteDamFeature("reservoir", damId)
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
              router.push(`/dam/${damId}${reservoir.path}`);
            }
          })
          .finally(() => setIsDeleting(true));
      });
    }
  };

  const handleResetform = () => {
    form.reset();
  };

  const form = useForm<z.infer<typeof DamReservoirSchema>>({
    resolver: zodResolver(DamReservoirSchema),
    defaultValues: (damReservoir || {
      //Reservoir Features
      flood_area: 0,
      reservoir_length: 0,
      total_capacity: 0,
      useful_capacity: 0,
      dead_volume: 0,
      fsl: 0,
      mfl: 0,
      mol: 0,
    }) as z.infer<typeof DamReservoirSchema>,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="space-y-4">
            {/* Reservoir features*/}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      {reservoir.id}
                    </div>
                    <div className="text-yellow-500">
                      {reservoir.description}
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>{reservoir.subtext}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="flood_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Flooded area at FSL* (m<sup>2</sup>)
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

                <FormField
                  control={form.control}
                  name="reservoir_length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fetch (m)</FormLabel>
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
                <CardTitle className="pb-2 pt-4 text-sm font-semibold">
                  Notable levels (m):
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

            <DamFormButtons
              damId={damId}
              damFeature={damReservoir}
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
