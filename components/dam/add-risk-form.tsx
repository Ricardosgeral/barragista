"use client";

import { DamRiskSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DamClass, DamRisk } from "@prisma/client";
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
  LuCheck,
  LuChevronsUpDown,
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

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { damFormSteps } from "@/data/dam/constants";
import FormButtons from "./form-buttons";
const risk = damFormSteps.sidebarNav[11];

interface AddDamRiskFormProps {
  // dam: DamWithAllFeatures | null;
  damId: string | null;
  damRisk: DamRisk | null; //if null will create a dam
}
//to use the enum defined in dam.prisma
const damClassArray = Object.entries(DamClass).map(([key, value]) => ({
  label: key,
  value: value,
}));
export default function AddDamRiskForm({
  damId,
  damRisk,
}: AddDamRiskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof DamRiskSchema>) => {
    setIsLoading(true);
    if (damRisk && damId) {
      // update with a given dam ID
      startTransition(() => {
        setIsLoading(true);
        updateDamFeature("risk", values, damId)
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
              router.push(`/dam/${damId}${risk.path}`);
            }
          })
          .finally(() => setIsLoading(false));
      });
    } else {
      // create (use of the server action... Could alse be done with API.)
      if (damId) {
        startTransition(() => {
          setIsLoading(true);
          createDamFeature("risk", values, damId)
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
                router.push(`/dam/${damId}${risk.path}`);
              }
            })

            .finally(() => setIsLoading(false));
        });
      }
    }
  };

  const handleDelete = (damId: string, damRisk: DamRisk) => {
    if (damId && damRisk) {
      // update a dam witha given ID
      startTransition(() => {
        setIsDeleting(true);
        deleteDamFeature("risk", damId)
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
              router.push(`/dam/${damId}${risk.path}`);
            }
          })
          .finally(() => {
            setIsDeleting(true);
          });
      });
    }
  };

  const handleResetform = () => {
    form.reset();
  };

  const form = useForm<z.infer<typeof DamRiskSchema>>({
    resolver: zodResolver(DamRiskSchema),
    defaultValues: (damRisk || {
      // Risk managment
      class: DamClass.Unknown,
      persons_downstream: 0,
      houses_downstream: 0,
      other_downstream: "",
      resettlement: "",
      sismicity: "",
      geo_conditions: "",
      design_flow: "",
      reservoir_management: "",
      env_harshness: "",
      project_construction: "",
      foundations: "",
      discharge_structures: "",
      maintenance: "",
    }) as z.infer<typeof DamRiskSchema>,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="space-y-4">
            {/* Risk Class of dam */}
            <Card className="w-full drop-shadow-lg sm:w-[400px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-start space-x-2">
                    <div className="flex size-5 items-center justify-center rounded-lg border-2 border-yellow-500 text-xs font-bold text-yellow-500">
                      {risk.id}
                    </div>
                    <div className="text-yellow-500">{risk.description}</div>
                  </div>
                </CardTitle>
                <CardDescription>{risk.subtext}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex w-full flex-col gap-4">
                  <FormLabel className="underline">
                    Potential damage (D)
                  </FormLabel>
                  <div className="grid w-full grid-cols-2 gap-4">
                    {/* Class */}
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-2.5 py-2">
                            <FormLabel>Class*</FormLabel>
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
                                      ? damClassArray.find(
                                          (damClassArray) =>
                                            damClassArray.value === field.value,
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
                                    <CommandEmpty>No class found</CommandEmpty>
                                    <CommandGroup>
                                      <CommandList>
                                        {damClassArray.map(
                                          (damClassArray, index) => (
                                            <CommandItem
                                              value={damClassArray.label}
                                              key={index}
                                              onSelect={() => {
                                                form.setValue(
                                                  "class",
                                                  damClassArray.value,
                                                );
                                              }}
                                            >
                                              <LuCheck
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  damClassArray.value ===
                                                    field.value
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                              {damClassArray.label}
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
                    <FormField
                      control={form.control}
                      name="persons_downstream"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Persons downstream</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="houses_downstream"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Houses downstream</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="other_downstream"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Other Infrastructrures</FormLabel>
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
                  </div>

                  <FormLabel className="pt-4 underline">
                    External or enviornmental factors (E)
                  </FormLabel>

                  <div className="grid w-full grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sismicity"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Sismicity</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="geo_conditions"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Geological/Geotecnical</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="design_flow"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Design flow</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="reservoir_management"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Reservoir management</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="env_harshness"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Environmental harshness</FormLabel>
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
                  </div>

                  <FormLabel className="pt-4 underline">
                    Dam vulnerability (V)
                  </FormLabel>

                  <div className="grid w-full grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="project_construction"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Project and construction</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="foundations"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Foundations</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="discharge_structures"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Discharge structures</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="maintenance"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Maintenace/conservation</FormLabel>
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
                  </div>
                </div>
              </CardContent>
            </Card>

            <FormButtons
              damId={damId}
              damFeature={damRisk}
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
