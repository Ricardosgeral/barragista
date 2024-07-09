"use client";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Tag, TagInput } from "emblor";
import { useForm } from "react-hook-form";
import { Dam, DamMaterial } from "@prisma/client";
import { DamSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { startTransition, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { PopoverClose } from "@radix-ui/react-popover";

import { damProfile, damPurpose, damFormSteps } from "@/data/dam/constants";
import { useRouter } from "next/navigation";

import { createDam } from "@/actions/dam/create-dam";
import { updateDam } from "@/actions/dam/update-dam";
import { deleteDam } from "@/actions/dam/delete-dam";

import { parseCookies } from "nookies";
import DamFormButtons from "@/components/dam/dam-form-buttons";

//to use the enum defined in dam.prisma
const damMaterialArray = Object.entries(DamMaterial).map(([key, value]) => ({
  label: key,
  value: value,
}));
const identification = damFormSteps.sidebarNav[0];

interface AddDamFormProps {
  dam: Dam | null; //if null will create a dam
}

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
      public: true,
      description: "",
    }) as z.infer<typeof DamSchema>,
  });

  const { setValue } = form;

  const router = useRouter();

  const handleDeleteDam = (damId: String) => {
    if (dam) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDamDeleting(true);
        deleteDam(dam.id)
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
              router.push(`/dam/new${identification.path}`);
            }
          })
          .finally(() => setIsDamDeleting(true));
      });
    }
  };
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
              router.push(`/dam/${data.dam?.id}${identification.path}`);
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
              router.push(`/dam/${data.dam?.id}${identification.path}`);
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
            <div className="space-y-4">
              {/* General data */}
              <Card className="w-full drop-shadow-lg sm:w-[400px]">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center justify-start space-x-2">
                      <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                        {identification.id}
                      </div>
                      <div className="text-yellow-500">
                        {identification.description}
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription>{identification.subtext}</CardDescription>
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
                    <div className="flex flex-col gap-4">
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
                    <div className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="public"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormLabel className="flex justify-center">
                              Public
                            </FormLabel>
                            <FormControl>
                              <div className="flex justify-center">
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DamFormButtons
                damId={dam && dam.id}
                damFeature={dam}
                isLoading={isLoading}
                isDeleting={isDamDeleting}
                handleDelete={handleDeleteDam}
                handleResetform={handleResetform}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
