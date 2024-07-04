"use client";

import { DamHydrologySchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamHydrology } from "@prisma/client";
import { useForm } from "react-hook-form";
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
                router.push(`/dam/${damId}${hydrology.path}`);
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
          <div className="flex w-full flex-col items-stretch justify-center gap-6 sm:flex-row sm:flex-wrap">
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
          </div>

          <div className="flex w-full items-center lg:w-1/2">
            <div className="flex w-full items-center justify-around">
              <div className="flex justify-start gap-4">
                {/* delete dam Button */}
                {damId && damHydrology && (
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
                          onClick={() => handleDelete(damId, damHydrology)}
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

                {damId && damHydrology && (
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
                {damId && damHydrology ? (
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
