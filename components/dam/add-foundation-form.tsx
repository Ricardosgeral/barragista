"use client";

import { DamFoundationSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamFoundation } from "@prisma/client";
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
import { Textarea } from "../ui/textarea";
import { Tag, TagInput } from "emblor";
import {
  damFoundationType,
  damFoundationTreatment,
} from "@/data/dam/constants";

import { damFormSteps } from "@/data/dam/constants";
import DamFormButtons from "@/components/dam/dam-form-buttons";

const foundation = damFormSteps.sidebarNav[6];

interface AddDamFoundationFormProps {
  damId: string | null;
  damFoundation: DamFoundation | null; //if null will create a dam
}

export default function AddDamFoundationForm({
  damId,
  damFoundation,
}: AddDamFoundationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [tagsFoundation, setTagsFoundation] = useState<Tag[]>([]);
  const [activeTagFoundationIndex, setActiveTagFoundationIndex] = useState<
    number | null
  >(null);

  const [tagsTreatment, setTagsTreatment] = useState<Tag[]>([]);
  const [activeTagTreatmentIndex, setActiveTagTreatmentIndex] = useState<
    number | null
  >(null);

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof DamFoundationSchema>) => {
    setIsLoading(true);
    if (damFoundation && damId) {
      // update  with a given dam ID
      startTransition(() => {
        setIsLoading(true);
        setIsDeleting(false);

        updateDamFeature("foundation", values, damId)
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
              router.push(`/dam/${damId}${foundation.path}`);
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

          createDamFeature("foundation", values, damId)
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
                router.push(`/dam/${damId}/discharge`);
              }
            })

            .finally(() => {
              setIsDeleting(false); //router.refresh();
              setTimeout(() => {
                window.location.reload();
              }, 100);
            });
        });
      }
    }
  };

  const handleDelete = (damId: string, damFoundation: DamFoundation) => {
    if (damId && damFoundation) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDeleting(true);
        deleteDamFeature("foundation", damId)
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
              router.push(`/dam/${damId}${foundation.path}`);
            }
          })
          .finally(() => setIsDeleting(true));
      });
    }
  };

  const handleResetform = () => {
    form.reset();
  };

  const form = useForm<z.infer<typeof DamFoundationSchema>>({
    resolver: zodResolver(DamFoundationSchema),
    defaultValues: (damFoundation || {
      //Foundation
      foundation_type: JSON.parse("[]"),
      foundation_geology: "",
      foundation_treatment: JSON.parse("[]"),
      foundation_notes: "",
    }) as z.infer<typeof DamFoundationSchema>,
  });

  const { setValue } = form;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="space-y-4">
            {/* Hydropower plant */}
            <Card className="min-w-[320px] max-w-[500px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      {foundation.id}
                    </div>
                    <div className="text-yellow-500">
                      {foundation.description}
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>{foundation.subtext} </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full space-y-4">
                  {/* Foundation type */}
                  <FormField
                    control={form.control}
                    name="foundation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dominant foundation type</FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            placeholder="Select from list (max 3)"
                            tags={field.value || tagsFoundation}
                            minTags={1}
                            variant={"default"}
                            size={"sm"}
                            shape={"pill"}
                            maxTags={3}
                            borderStyle={"none"}
                            activeTagIndex={activeTagFoundationIndex}
                            draggable={true}
                            setActiveTagIndex={setActiveTagFoundationIndex}
                            className=""
                            setTags={(newTags) => {
                              setTagsFoundation(newTags);
                              setValue(
                                "foundation_type",
                                newTags as [Tag, ...Tag[]],
                              );
                            }}
                            enableAutocomplete
                            autocompleteOptions={damFoundationType}
                            restrictTagsToAutocompleteOptions={true}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="foundation_geology"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Geology of region/local</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="h-20" />
                        </FormControl>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Foundation treatment */}
                  <FormField
                    control={form.control}
                    name="foundation_treatment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Foundation treatment</FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            placeholder="Select from list (max 5)"
                            tags={field.value || tagsTreatment}
                            minTags={1}
                            variant={"default"}
                            size={"sm"}
                            shape={"pill"}
                            maxTags={5}
                            borderStyle={"none"}
                            activeTagIndex={activeTagTreatmentIndex}
                            draggable={true}
                            setActiveTagIndex={setActiveTagTreatmentIndex}
                            className=""
                            setTags={(newTags) => {
                              setTagsTreatment(newTags);
                              setValue(
                                "foundation_treatment",
                                newTags as [Tag, ...Tag[]],
                              );
                            }}
                            enableAutocomplete
                            autocompleteOptions={damFoundationTreatment}
                            restrictTagsToAutocompleteOptions={true}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="foundation_notes"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Additional notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="h-20" />
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
              damFeature={damFoundation}
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
