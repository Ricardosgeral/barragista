"use client";

import { DamSpillwaySchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamSpillway } from "@prisma/client";
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
  LuLoader2,
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

import { createDamFeature } from "@/actions/dam/create-dam-features";
import { updateDamFeature } from "@/actions/dam/update-dam-features";
import { deleteDamFeature } from "@/actions/dam/delete-dam-feature";
import { useRouter } from "next/navigation";

import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { damFormSteps } from "@/data/dam/constants";
const spillway = damFormSteps.sidebarNav[8];

interface AddDamSpillwayFormProps {
  damId: string | null;
  damSpillway: DamSpillway | null; //if null will create a dam
}

export default function AddDamSpillwayForm({
  damId,
  damSpillway,
}: AddDamSpillwayFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof DamSpillwaySchema>) => {
    setIsLoading(true);
    if (damSpillway && damId) {
      // update  with a given dam ID
      startTransition(() => {
        setIsLoading(true);
        updateDamFeature("spillway", values, damId)
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
              router.push(`/dam/${damId}${spillway.path}`);
            }
          })
          .finally(() => setIsLoading(false));
      });
    } else {
      // create (use of the server action... Could alse be done with API.)
      if (damId) {
        startTransition(() => {
          setIsLoading(true);
          createDamFeature("spillway", values, damId)
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
                router.push(`/dam/${damId}${spillway.path}`);
              }
            })

            .finally(() => setIsLoading(false));
        });
      }
    }
  };

  const handleDelete = (damId: string, damSpillway: DamSpillway) => {
    if (damId && damSpillway) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDeleting(true);
        deleteDamFeature("spillway", damId)
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
              router.push(`/dam/${damId}${spillway.path}`);
            }
          })
          .finally(() => setIsDeleting(true));
      });
    }
  };

  const handleResetform = () => {
    form.reset();
  };

  const form = useForm<z.infer<typeof DamSpillwaySchema>>({
    resolver: zodResolver(DamSpillwaySchema),
    defaultValues: (damSpillway || {
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
    }) as z.infer<typeof DamSpillwaySchema>,
  });

  const { watch, setValue } = form;

  const watchHasSpillway = watch("has_spillway", false);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="flex w-full flex-col items-stretch justify-center gap-6 sm:flex-row sm:flex-wrap">
            {/* Spillway */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      {spillway.id}
                    </div>
                    <div className="text-yellow-500">
                      {spillway.description}
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>{spillway.subtext}</CardDescription>
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
                              <FormLabel>Type</FormLabel>
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
          </div>

          <div className="flex w-full items-center lg:w-1/2">
            <div className="flex w-full items-center justify-around">
              <div className="flex justify-start gap-4">
                {/* delete dam Button */}
                {damId && damSpillway && (
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
                          onClick={() => handleDelete(damId, damSpillway)}
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

                {damId && damSpillway && (
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
                {damId && damSpillway ? (
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