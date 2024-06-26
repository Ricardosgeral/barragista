"use client";
import {
  Dam,
  DamLocation,
  DamProject,
  DamHydrology,
  DamReservoir,
  DamBody,
  DamFoundation,
  DamBtDischarge,
  DamSpillway,
  DamEnvFlow,
  DamHydropower,
  DamRisk,
  DamClass,
  DamMaterial,
  DamFile,
} from "@prisma/client";
import { startTransition, useState } from "react";

const damClassArray = Object.entries(DamClass).map(([key, value]) => ({
  label: key,
  value: value,
}));

//to use the enum defined in dam.prisma
const damMaterialArray = Object.entries(DamMaterial).map(([key, value]) => ({
  label: key,
  value: value,
}));

interface AddDamFormProps {
  // dam: DamWithAllFeatures | null;
  dam: Dam | null; //if null will create a dam
}

// export type DamWithAllFeatures = Dam & {
//   location: DamLocation;
//   projectConstruction: DamProject;
//   hydrology: DamHydrology;
//   reservoir: DamReservoir;
//   damBody: DamBody;
//   Foundation: DamFoundation;
//   bottomDischarge: DamBtDischarge;
//   spillway: DamSpillway;
//   envFlow: DamEnvFlow;
//   hydropower: DamHydropower;
//   risk: DamRisk;
//   files: DamFile[];
// };
import { Tag, TagInput } from "emblor";
import { useForm } from "react-hook-form";
import { DamSchema } from "@/schemas/dam-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  LuCheck,
  LuChevronsUpDown,
  LuEye,
  LuLoader2,
  LuPencil,
  LuPencilLine,
  LuRefreshCcw,
  LuTrash2,
} from "react-icons/lu";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Textarea } from "../ui/textarea";
import { damProfile, damPurpose } from "@/data/dam/constants";
import { useRouter } from "next/navigation";
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
} from "../ui/alert-dialog";
import { updateDam } from "@/actions/dam/update-dam";
import { toast } from "../ui/use-toast";
import { createDam } from "@/actions/dam/create-dam";

import { parseCookies } from "nookies";

export default function AddDamForm({ dam }: AddDamFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDamDeleting, setIsDamDeleting] = useState(false);

  const [tagsProfile, setTagsProfile] = useState<Tag[]>([]);
  const [activeTagProfileIndex, setActiveTagProfileIndex] = useState<
    number | null
  >(null);

  const [tagsPurpose, setTagsPurpose] = useState<Tag[]>([]);
  const [activeTagPurposeIndex, setActiveTagPurposeIndex] = useState<
    number | null
  >(null);

  const cookies = parseCookies();
  const serializedDamInfo = cookies.damInfo;

  let damInfo: AddDamFormProps | null = null;

  if (serializedDamInfo) {
    damInfo = JSON.parse(serializedDamInfo);
  }

  const form = useForm<z.infer<typeof DamSchema>>({
    resolver: zodResolver(DamSchema),
    defaultValues: (dam || {
      //if dam exists populate fields with that dam data otherwise use the following
      name: "",
      material: DamMaterial.Other,
      profile: JSON.parse("[]"),
      purpose: JSON.parse("[]"),
      description: "",
    }) as z.infer<typeof DamSchema>,
  });

  const { setValue } = form;
  const router = useRouter();

  const handleDeleteDam = (damId: String) => {};

  const handleResetform = () => {
    form.reset();
  };
  const onSubmit = (values: z.infer<typeof DamSchema>) => {
    setIsLoading(true);
    if (dam) {
      // update a dam witha given ID
      startTransition(() => {
        setIsLoading(true);
        updateDam(values, dam.id)
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
              router.push(`/dam/${data.dam?.id}`);
            }
          })
          .finally(() => setIsLoading(false));
      });
    } else {
      // create (use of the server action... Could alse be done with API.)
      startTransition(() => {
        setIsLoading(true);
        createDam(values)
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
              router.push(`/dam/${data.dam?.id}`);
            }
          })
          .finally(() => setIsLoading(false));
      });
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col items-center justify-center space-y-6">
            <div className="flex w-full flex-col items-stretch justify-center gap-6 sm:flex-row sm:flex-wrap">
              {/* General data */}
              <Card className="w-full drop-shadow-lg sm:w-[400px]">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center justify-start space-x-2">
                      <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                        1
                      </div>
                      <div className="text-yellow-500">
                        General identification
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription>Overall data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex w-full flex-col gap-4">
                    {/* Name of dam */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Name*</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded border text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Material of dam */}
                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem className="flex w-2/3 flex-col">
                          <div className="flex flex-col gap-2.5 py-2">
                            <FormLabel>Material*</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "justify-between",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value
                                      ? damMaterialArray.find(
                                          (damMaterialArray) =>
                                            damMaterialArray.value ===
                                            field.value,
                                        )?.label
                                      : "Select"}
                                    <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[150px] p-0">
                                <PopoverClose asChild>
                                  <Command>
                                    <CommandInput placeholder="Choose" />
                                    <CommandEmpty>
                                      No Material found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      <CommandList>
                                        {damMaterialArray.map(
                                          (damMaterialArray, index) => (
                                            <CommandItem
                                              value={damMaterialArray.label}
                                              key={index}
                                              onSelect={() => {
                                                form.setValue(
                                                  "material",
                                                  damMaterialArray.value,
                                                );
                                              }}
                                            >
                                              <LuCheck
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  damMaterialArray.value ===
                                                    field.value
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                              {damMaterialArray.label}
                                            </CommandItem>
                                          ),
                                        )}
                                      </CommandList>
                                    </CommandGroup>
                                  </Command>
                                </PopoverClose>
                              </PopoverContent>
                            </Popover>

                            <FormMessage className="text-xs" />
                          </div>
                        </FormItem>
                      )}
                    />
                    {/* Structure type */}
                    <FormField
                      control={form.control}
                      name="profile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile/structure type*</FormLabel>
                          <FormControl>
                            <TagInput
                              {...field}
                              placeholder="Select from list (max 5)"
                              tags={field.value || tagsProfile}
                              minTags={1}
                              variant={"default"}
                              size={"sm"}
                              shape={"pill"}
                              maxTags={5}
                              borderStyle={"none"}
                              activeTagIndex={activeTagProfileIndex}
                              draggable={true}
                              setActiveTagIndex={setActiveTagProfileIndex}
                              className=""
                              setTags={(newTags) => {
                                setTagsProfile(newTags);
                                setValue("profile", newTags as [Tag, ...Tag[]]);
                              }}
                              enableAutocomplete
                              autocompleteOptions={damProfile}
                              restrictTagsToAutocompleteOptions={true}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    {/* Purpose */}
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose*</FormLabel>
                          <FormControl>
                            <TagInput
                              {...field}
                              placeholder="Select from list (max 6)"
                              tags={field.value || tagsPurpose}
                              minTags={1}
                              variant={"default"}
                              size={"sm"}
                              shape={"pill"}
                              maxTags={6}
                              borderStyle={"none"}
                              activeTagIndex={activeTagPurposeIndex}
                              draggable={true}
                              setActiveTagIndex={setActiveTagPurposeIndex}
                              className=""
                              setTags={(newTags) => {
                                setTagsPurpose(newTags);
                                setValue("purpose", newTags as [Tag, ...Tag[]]);
                              }}
                              enableAutocomplete
                              autocompleteOptions={damPurpose}
                              restrictTagsToAutocompleteOptions={true}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
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
                  {dam && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          type="button"
                          disabled={isDamDeleting || isLoading}
                        >
                          {isDamDeleting ? (
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
                            onClick={() => handleDeleteDam(dam.id)}
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

                  {dam && (
                    <>
                      <Button
                        variant="default"
                        onClick={() => {
                          router.push(`/dam-details/${dam.id}`);
                        }}
                      >
                        <LuEye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </>
                  )}

                  {/* create/update Dam Buttons */}
                  {dam ? (
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
                          <LuPencil className="mr-2 h-4 w-4" /> Create Dam
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
    </>
  );
}
