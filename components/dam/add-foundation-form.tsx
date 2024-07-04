"use client";

import { DamFoundationSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamFoundation } from "@prisma/client";
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
                router.push(`/dam/${damId}${foundation.path}`);
              }
            })

            .finally(() => setIsLoading(false));
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
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="flex w-full flex-col items-stretch justify-center gap-6 sm:flex-row sm:flex-wrap">
            {/* Foundation */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
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
          </div>

          <div className="flex w-full items-center lg:w-1/2">
            <div className="flex w-full items-center justify-around">
              <div className="flex justify-start gap-4">
                {/* delete dam Button */}
                {damId && damFoundation && (
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
                          onClick={() => handleDelete(damId, damFoundation)}
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

                {damId && damFoundation && (
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
                {damId && damFoundation ? (
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
