"use client";

import { DamDischargeSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamDischarge } from "@prisma/client";
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
import DamFormButtons from "@/components/dam/dam-form-buttons";

const discharge = damFormSteps.sidebarNav[7];

interface AddDamDischargeFormProps {
  damId: string | null;
  damDischarge: DamDischarge | null; //if null will create a dam
}

export default function AddDamDischargeForm({
  damId,
  damDischarge,
}: AddDamDischargeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof DamDischargeSchema>) => {
    setIsLoading(true);
    setIsDeleting(false);

    if (damDischarge && damId) {
      // update  with a given dam ID
      startTransition(() => {
        setIsLoading(true);
        setIsDeleting(false);

        updateDamFeature("discharge", values, damId)
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
              router.push(`/dam/${damId}${discharge.path}`);
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

          createDamFeature("discharge", values, damId)
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
                router.push(`/dam/${damId}/spillway`);
              }
            })

            .finally(() => setIsLoading(false));
        });
      }
    }
  };

  const handleDelete = (damId: string, damDischarge: DamDischarge) => {
    if (damId && damDischarge) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDeleting(true);
        deleteDamFeature("discharge", damId)
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
              router.push(`/dam/${damId}${discharge.path}`);
            }
          })
          .finally(() => setIsDeleting(true));
      });
    }
  };

  const handleResetform = () => {
    form.reset();
  };

  const form = useForm<z.infer<typeof DamDischargeSchema>>({
    resolver: zodResolver(DamDischargeSchema),
    defaultValues: (damDischarge || {
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
    }) as z.infer<typeof DamDischargeSchema>,
  });

  const { watch, setValue } = form;

  const watchHasBottomDischarge = watch("has_btd");

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="space-y-4">
            {/* Bottom discharge */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      {discharge.id}
                    </div>
                    <div className="text-yellow-500">
                      {discharge.description}
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>{discharge.subtext}</CardDescription>
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
                              <FormLabel>Section type</FormLabel>
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

            <DamFormButtons
              damId={damId}
              damFeature={damDischarge}
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
