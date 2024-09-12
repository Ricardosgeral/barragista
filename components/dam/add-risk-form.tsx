"use client";

import { DamRiskSchema } from "@/schemas/dam-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DamLocation,
  DamBody,
  DamClass,
  DamReservoir,
  DamRisk,
} from "@prisma/client";
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
import { Button } from "@/components/ui/button";
import { LuCheck, LuChevronsUpDown, LuHelpCircle } from "react-icons/lu";
import { toast } from "@/components/ui/use-toast";
import { startTransition, useEffect, useState } from "react";
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
import DamFormButtons from "@/components/dam/dam-form-buttons";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@radix-ui/react-separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useDamRiskEffectsPT from "@/hooks/dam/use-damRisk-PT"; // Custom hook

const risk = damFormSteps.sidebarNav[11];

interface AddDamRiskFormProps {
  damId: string | null;
  damLocation: DamLocation | null;
  damRisk: DamRisk | null; //if null will create a dam
  damBody: DamBody | null;
  damReservoir: DamReservoir | null;
}
//to use the enum defined in dam.prisma
const damClassArray = Object.entries(DamClass).map(([key, value]) => ({
  label: key,
  value: value,
}));
export default function AddDamRiskForm({
  damId,
  damLocation,
  damRisk,
  damBody,
  damReservoir,
}: AddDamRiskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const country = damLocation?.country;

  const onSubmit = (values: z.infer<typeof DamRiskSchema>) => {
    setIsLoading(true);
    if (damRisk && damId) {
      // update with a given dam ID
      startTransition(() => {
        setIsLoading(true);
        setIsDeleting(false);

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
          setIsDeleting(false);

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
            setIsDeleting(false); //router.refresh();
            setTimeout(() => {
              window.location.reload();
            }, 100);
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
      has_infrastructures: false,
      infrastructures: "",
      has_pei: false,
      pei: "",
      hazard_factor_X: 0,
      sismicity: 0,
      geo_conditions: 0,
      design_flow: 0,
      reservoir_management: 0,
      env_harshness: 0,
      project_construction: 0,
      foundations: 0,
      discharge_structures: 0,
      maintenance: 0,
      risk_E: 0,
      risk_V: 0,
      risk_D: 0,
      risk_global: 0,
    }) as z.infer<typeof DamRiskSchema>,
  });

  // useState and useEffects for upstating states in damRisk based on changes also in damBody and damReservoir
  // updtates X as well as the risk factors
  const { hasInfrastructures, hasPei } = useDamRiskEffectsPT(
    form,
    damBody,
    damReservoir,
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <div className="space-y-4">
            {/* Hydropower plant */}
            <Card className="min-w-[320px] max-w-[500px]">
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
                <div className="flex w-full flex-col items-center gap-4">
                  <FormLabel
                    style={{ fontVariant: "small-caps" }}
                    className="text-md flex font-extrabold text-yellow-500"
                  >
                    Dam Classification
                    {country === "PT" && ` Standard: ${country} - RSB(2018)`}
                  </FormLabel>
                  <div className="flex w-full flex-col gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Class */}

                      <FormField
                        control={form.control}
                        name="hazard_factor_X"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel>
                                    <span className="flex items-center justify-start gap-2">
                                      X | Hazard
                                      <LuHelpCircle className="text-xs" />
                                    </span>
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Hazard factor = H<sup>2</sup> / √V, <br />
                                    where H in the height of the dam body (m),
                                    and V the reservoir volume (hm<sup>3</sup>)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <FormControl>
                              <Input
                                readOnly={true}
                                className="rounded border bg-foreground/5 text-base"
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel>
                                    <span className="flex items-center justify-start gap-2">
                                      Y | Houses
                                      <LuHelpCircle className="text-xs" />
                                    </span>
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Permanent residential buildings</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={1}
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
                        name="persons_downstream"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel>
                                    <span className="flex items-center justify-start gap-2">
                                      Residents
                                      <LuHelpCircle className="text-xs" />
                                    </span>
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Permanent residents in the flood zone impact
                                    area.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={1}
                                className="rounded border text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid w-full grid-cols-2 gap-4 py-2">
                      <FormField
                        control={form.control}
                        name="has_infrastructures"
                        render={({ field }) => (
                          <FormItem className="">
                            <div className="">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FormLabel className="flex gap-x-2 py-2">
                                      Important infrastructures?
                                      <LuHelpCircle className="text-xs" />
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Important or relevant infrastructures
                                      affected by dam failure. <br />
                                      If so, you should mention which ones.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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
                      {hasInfrastructures && (
                        <FormField
                          control={form.control}
                          name="infrastructures"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel></FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="..."
                                  className="rounded border text-base"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <div className="w-full pt-2">
                      <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center gap-2.5">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FormLabel>
                                      <span className="flex items-center justify-start gap-2">
                                        Dam Class
                                        <LuHelpCircle className="text-xs" />
                                      </span>
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Dam Hazard Classification and Potential
                                    Damage <br />
                                    (updates automatically but can be set
                                    manually)
                                    <div className="flex flex-col items-start justify-start pl-5">
                                      <ul className="list-disc py-3">
                                        <li className="pt-2 font-bold">
                                          Class I:
                                        </li>
                                        <ul>
                                          <li> Y ≥ 10 and X ≥ 1000</li>
                                        </ul>
                                        <li className="pt-2 font-bold">
                                          Class II:
                                        </li>
                                        <ul>
                                          <li>Y ≥ 10 and X &lt; 1000, or</li>
                                          <li>
                                            0 &lt; Y &lt; 10, regardless of the
                                            value of X, or
                                          </li>
                                          <li>
                                            Presence of important
                                            infrastructure, facilities, <br />
                                            and environmental assets
                                          </li>
                                        </ul>
                                        <li className="pt-2 font-bold">
                                          Class III:
                                        </li>
                                        <ul>
                                          <li>
                                            Y = 0, regardless of the value of X
                                          </li>
                                        </ul>
                                      </ul>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <FormLabel className="font-bold"></FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "justify-between bg-foreground/10 font-bold",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value
                                        ? damClassArray.find(
                                            (damClassArray) =>
                                              damClassArray.value ===
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
                                        No class found
                                      </CommandEmpty>
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
                    </div>
                  </div>
                  <Separator
                    className="foreground/20 h-1 w-4/5 border-b-2 py-2"
                    orientation="horizontal"
                  />
                  <FormLabel
                    style={{ fontVariant: "small-caps" }}
                    className="text-md font-extrabold text-yellow-500"
                  >
                    Risk Factors
                    {country === "PT" &&
                      `: ${country} - RSB(2018) & Support docs`}
                  </FormLabel>
                  <FormLabel style={{ fontVariant: "small-caps" }} className="">
                    External or Enviornmental Factors (E)
                  </FormLabel>
                  <div className="flex w-full flex-col gap-4">
                    <div className="grid w-full grid-cols-2 gap-4 py-2">
                      <FormField
                        control={form.control}
                        name="sismicity"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="flex gap-x-2 py-2">
                                    <p>
                                      Sismicity, &alpha; <sub> 1 </sub>
                                    </p>
                                    <LuHelpCircle className="text-xs" />
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="flex space-y-2 text-sm font-thin">
                                    Based on &beta; - Maximum acceleration
                                    corresponding <br />
                                    to the maximum design earthquake <br />
                                    <br />1 - Very low (β &lt; 0,05g)
                                    <br /> 2 - Low (0.1g &lt; β &lt; 0.2g)
                                    <br /> 3 - Average (0.1g &lt; β &lt; 0.2g)
                                    <br /> 4 - Strong (0.1g &lt; β &lt; 0.2g)
                                    <br /> 5 - Very strong β &gt; 0.4g
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={5}
                                step={1}
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="flex gap-x-2 py-2">
                                    <p>
                                      Geology/geotech, &alpha; <sub> 2 </sub>
                                    </p>
                                    <LuHelpCircle className="text-xs" />
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="flex space-y-2 text-sm font-thin">
                                    Based on Geological and geotechnical
                                    conditions <br /> <br />1 - Very good
                                    <br /> 2 - Good
                                    <br /> 3 - Acceptable
                                    <br /> 4 - —
                                    <br /> 5 - Poor
                                    <br /> 6 - Poor to bad
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={6}
                                step={1}
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="flex gap-x-2 py-2">
                                    <p>
                                      Design flood, &alpha; <sub> 3 </sub>
                                    </p>
                                    <LuHelpCircle className="text-xs" />
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="flex space-y-2 text-sm font-thin">
                                    Based on &delta; - Percentage reduction of
                                    <br />
                                    the freeboard resulting from the damping of
                                    <br />
                                    the revised design flood (freeboard: the
                                    <br />
                                    difference between the crest elevation and
                                    <br />
                                    the maximum flood level) <br /> <br />1 -
                                    Minimum (&delta; &lt; 5%)
                                    <br /> 2 - Low (5 &lt; &delta; &lt; 15%, for
                                    concrete dams)
                                    <br /> 3 - Low (5 &lt; &delta; &lt; 10%, for
                                    embankment dams)
                                    <br /> 4 - Average (15 &lt; &delta; &lt;
                                    25%, for concrete dams)
                                    <br /> 5 - Average (10 &lt; &delta; &lt;
                                    20%, for embankment dams)
                                    <br /> 6 - High
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={6}
                                step={1}
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="flex gap-x-2 py-2">
                                    <p>
                                      Reservoir , &alpha;
                                      <sub> 4 </sub>
                                    </p>
                                    <LuHelpCircle className="text-xs" />
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="flex space-y-2 text-sm font-thin">
                                    Based on the type of management of the dam
                                    reservoir <br /> <br />1 - Multiyear, annual
                                    or seasonal
                                    <br /> 2 - Weekly
                                    <br /> 3 - Daily and with pumping
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={3}
                                step={1}
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="flex gap-x-2 py-2">
                                    <p>
                                      Harshness conditions, &alpha;
                                      <sub> 5 </sub>
                                    </p>
                                    <LuHelpCircle className="text-xs" />
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="flex text-sm font-thin">
                                    What is the aggressiveness of environmental
                                    actions <br /> <br />1 - Minimal
                                    <br /> 2 - Weak
                                    <br /> 3 - Average
                                    <br /> 4 - Strong
                                    <br /> 5 - Very strong
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={5}
                                step={1}
                                className="rounded border text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="risk_E"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-baseline space-x-4">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel>
                                    <span className="flex items-center justify-start gap-2 font-bold">
                                      Factor E:
                                      <LuHelpCircle className="text-xs" />
                                    </span>
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Average of individual Environmental factors
                                    factors
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                readOnly={true}
                                className="flex w-1/3 bg-foreground/10 font-bold"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormLabel
                    style={{ fontVariant: "small-caps" }}
                    className="pt-4"
                  >
                    Dam Vulnerability (V)
                  </FormLabel>
                  <div className="flex w-full flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="project_construction"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="flex gap-x-2 py-2">
                                    <p>
                                      Project/construction, &alpha;
                                      <sub> 5 </sub>
                                    </p>
                                    <LuHelpCircle className="text-xs" />
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="flex text-sm font-thin">
                                    Project and construction methods are <br />
                                    <br /> 1 - Adequate
                                    <br /> 2 - —
                                    <br /> 3 - Acceptable
                                    <br /> 4 - —
                                    <br /> 5 - —
                                    <br /> 6 - Not adequate
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={6}
                                step={1}
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
                            <FormLabel>
                              Foundations, &alpha;<sub>7</sub>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={6}
                                step={1}
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="flex gap-x-2 py-2">
                                    <p>
                                      Hydraulic structures, &alpha;
                                      <sub> 5 </sub>
                                    </p>
                                    <LuHelpCircle className="text-xs" />
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="flex text-sm font-thin">
                                    The available hydraulic/safety structures
                                    are
                                    <br />
                                    <br /> 1 - Reliable (flood gates without
                                    gates or without possible submersion)
                                    <br /> 2 - Reliable (flood gates with gates
                                    or with possible submersion)
                                    <br /> 3 - —
                                    <br /> 4 - —
                                    <br /> 5 - —
                                    <br /> 6 - Insufficient or inoperational
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={6}
                                step={1}
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="flex gap-x-2 py-2">
                                    <p>
                                      Maintenance, &alpha;
                                      <sub> 5 </sub>
                                    </p>
                                    <LuHelpCircle className="text-xs" />
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="flex text-sm font-thin">
                                    Preservation and maintenance conditions
                                    <br />
                                    <br /> 1 - Very good
                                    <br /> 2 - Good
                                    <br /> 3 - Reasonable
                                    <br /> 4 - —
                                    <br /> 5 - —
                                    <br /> 6 - Insufficient
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={6}
                                step={1}
                                className="rounded border text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="risk_V"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-baseline space-x-4">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel>
                                    <span className="flex items-center justify-start gap-2 font-bold">
                                      Factor V:
                                      <LuHelpCircle className="text-xs" />
                                    </span>
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Average of individual Dam Vulnerability
                                    factors
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                readOnly={true}
                                className="flex w-1/3 bg-foreground/10 font-bold"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormLabel
                    style={{ fontVariant: "small-caps" }}
                    className="pt-4"
                  >
                    Potential Damage (D)
                  </FormLabel>
                  <div className="flex w-full flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4 py-2">
                      <FormField
                        control={form.control}
                        name="has_pei"
                        render={({ field }) => (
                          <FormItem className="">
                            <div className="">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FormLabel className="flex gap-x-2 py-2">
                                      Internal emergency plan?
                                      <LuHelpCircle className="text-xs" />
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Check if the dam has an approved plan.
                                      <br />
                                      If yes you can include additional info.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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
                      {hasPei && (
                        <FormField
                          control={form.control}
                          name="pei"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel></FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="..."
                                  className="rounded border text-base"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="risk_D"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-baseline space-x-4">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel>
                                    <span className="flex items-center justify-start gap-2 font-bold">
                                      Factor D:
                                      <LuHelpCircle className="text-xs" />
                                    </span>
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="flex text-sm font-thin">
                                    Potential Damage, based on dam class <br />
                                    (obtained from data)
                                    <br />
                                    <br /> 1 - Class III
                                    <br /> 2 - Class II (with no residents)
                                    <br /> 3 - Class II (with residents)
                                    <br /> 4 - Class I (with IEP)
                                    <br /> 5 - —
                                    <br /> 6 - Class I (with no IEP)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <FormControl>
                              <Input
                                readOnly={true}
                                className="flex w-1/3 bg-foreground/10 font-bold"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormLabel
                    style={{ fontVariant: "small-caps" }}
                    className="pt-4 font-sans"
                  >
                    Global Risk Index
                  </FormLabel>
                  <div className="flex w-full justify-start">
                    <div className="flex">
                      <FormField
                        control={form.control}
                        name="risk_global"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-baseline space-x-4">
                            <FormLabel className="flex flex-nowrap font-bold">
                              E x V x D:
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="flex w-1/3 bg-foreground/40 font-bold text-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DamFormButtons
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
