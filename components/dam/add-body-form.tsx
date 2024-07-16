"use client";

import { DamBodySchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamBody } from "@prisma/client";
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

import { damFormSteps } from "@/data/dam/constants";
import DamFormButtons from "@/components/dam/dam-form-buttons";

const body = damFormSteps.sidebarNav[5];

interface AddDamBodyFormProps {
  damId: string | null;
  damBody: DamBody | null; //if null will create a dam
}

export default function AddDamBodyForm({
  damId,
  damBody,
}: AddDamBodyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof DamBodySchema>) => {
    setIsLoading(true);
    if (damBody && damId) {
      // update  with a given dam ID
      startTransition(() => {
        setIsLoading(true);
        setIsDeleting(false);

        updateDamFeature("body", values, damId)
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
              router.push(`/dam/${damId}${body.path}`);
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

          createDamFeature("body", values, damId)
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
                router.push(`/dam/${damId}/foundation`);
              }
            })

            .finally(() => setIsLoading(false));
        });
      }
    }
  };

  const handleDelete = (damId: string, damBody: DamBody) => {
    if (damId && damBody) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDeleting(true);
        deleteDamFeature("body", damId)
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
              router.push(`/dam/${damId}${body.path}`);
            }
          })
          .finally(() => setIsDeleting(true));
      });
    }
  };

  const handleResetform = () => {
    form.reset();
  };

  const form = useForm<z.infer<typeof DamBodySchema>>({
    resolver: zodResolver(DamBodySchema),
    defaultValues: (damBody || {
      //Body Features
      height_to_foundation: 0,
      height_to_natural: 0,
      crest_elevation: 0,
      crest_length: 0,
      crest_width: 0,
      embankment_volume: 0,
      concrete_volume: 0,
    }) as z.infer<typeof DamBodySchema>,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="space-y-4">
            {/* Dam Bodyfeatures*/}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      {body.id}
                    </div>
                    <div className="text-yellow-500">{body.description}</div>
                  </div>
                </CardTitle>
                <CardDescription>{body.subtext}</CardDescription>
              </CardHeader>
              <CardContent>
                <CardTitle className="pb-2 text-sm font-semibold">
                  Heigth (m):
                </CardTitle>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height_to_foundation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>above foundation*</FormLabel>
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
                        <FormLabel>above natural ground</FormLabel>
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
                  Crest parameters (m):
                </CardTitle>
                <div className="grid w-full grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="crest_elevation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>elevation</FormLabel>
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
                        <FormLabel>length</FormLabel>
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
                        <FormLabel>width</FormLabel>
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
                  Volume of building materials (m<sup>3</sup>):
                </CardTitle>
                <div className="grid w-full grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="embankment_volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>embankments</FormLabel>
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
                        <FormLabel>concrete</FormLabel>
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
              damFeature={damBody}
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
