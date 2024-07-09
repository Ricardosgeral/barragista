"use client";

import { usePathname } from "next/navigation";
import { damFormSteps } from "@/data/dam/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { isCuid } from "@/app/utils/isCuid";
import {
  Dam,
  DamBody,
  DamDischarge,
  DamEnvironmental,
  DamFoundation,
  DamHydrology,
  DamHydropower,
  DamLocation,
  DamProject,
  DamReservoir,
  DamRisk,
  DamSpillway,
} from "@prisma/client";
import { LuBadgeCheck } from "react-icons/lu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormStepsNavProps {
  damId: string | null;
  damData: Dam | null;
  damLocationData: DamLocation[] | null;
  damProjectData: DamProject[] | null;
  damHydrologyData: DamHydrology[] | null;
  damReservoirData: DamReservoir[] | null;
  damBodyData: DamBody[] | null;
  damFoundationData: DamFoundation[] | null;
  damDischargeData: DamDischarge[] | null;
  damSpillwayData: DamSpillway[] | null;
  damHydropowerData: DamHydropower[] | null;
  damEnvironmentalData: DamEnvironmental[] | null;
  damRiskData: DamRisk[] | null;
  // damFilesData: DamFiles | null;
}

export function FormStepsNav({
  damId,
  damData,
  damLocationData,
  damProjectData,
  damHydrologyData,
  damReservoirData,
  damBodyData,
  damFoundationData,
  damDischargeData,
  damSpillwayData,
  damHydropowerData,
  damEnvironmentalData,
  damRiskData,
}: FormStepsNavProps) {
  const pathname = usePathname();
  const path_segments = pathname.split("/");
  const current_step = path_segments[path_segments.length - 1];
  let hasDam: boolean = false;

  if (damId && isCuid(damId)) {
    hasDam = true;
  }

  const stepDataMap: Record<string, any[] | null> = {
    identification: damData ? [damData] : null,
    location: damLocationData,
    project: damProjectData,
    hydrology: damHydrologyData,
    reservoir: damReservoirData,
    body: damBodyData,
    foundation: damFoundationData,
    discharge: damDischargeData,
    spillway: damSpillwayData,
    hydropower: damHydropowerData,
    environmental: damEnvironmentalData,
    risk: damRiskData,
    // files: damFilesData, // Add this if you have files data
  };

  return (
    <nav>
      <div className="mb-4 font-bold">
        <div className="flex items-center">
          <div className="pr-2 text-foreground/50">Dam:</div>
          <div className="text-xl text-yellow-500">
            {damData ? damData.name : "..."}
          </div>
        </div>
      </div>

      <ul className="flex flex-col space-y-2">
        {damFormSteps.sidebarNav.map((step) => {
          // Normalize the path
          const normalizedStepPath = step.path.startsWith("/")
            ? step.path.substring(1)
            : step.path;

          const disableForm =
            !hasDam && normalizedStepPath !== "identification";

          const hasData = (stepDataMap[normalizedStepPath] ?? []).length > 0;

          return (
            <li key={step.id}>
              {disableForm ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex cursor-default items-center gap-x-2">
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-lg text-xs",
                            current_step === normalizedStepPath
                              ? "size-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500 to-yellow-400 font-bold text-background"
                              : "border bg-foreground/20 text-foreground/80",
                            "bg-foreground/10 text-foreground/20",
                          )}
                        >
                          {step.id}
                        </div>
                        <div
                          className={cn(
                            "flex items-center justify-center",
                            current_step === normalizedStepPath
                              ? "font-bold text-yellow-500"
                              : "text-foreground/80",
                            "text-foreground/20",
                          )}
                        >
                          {step.description}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>First create the dam</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Link href={`/dam/${damId}/${step.path}`}>
                  <div className="flex items-center gap-x-2 text-background">
                    <div
                      className={cn(
                        "relative flex h-6 w-6 items-center justify-center rounded-lg text-xs",
                        current_step === normalizedStepPath
                          ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500 to-yellow-400 font-bold text-background"
                          : "border bg-foreground/20 text-foreground/80",
                        hasData && "font-bold",
                      )}
                    >
                      {step.id}
                      {hasData && (
                        <LuBadgeCheck className="absolute -right-1 -top-1 rounded-full bg-background text-yellow-500" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex items-center justify-center",
                        current_step === normalizedStepPath
                          ? "font-bold text-yellow-500"
                          : "text-foreground/80",
                        hasData && "font-semibold",
                      )}
                    >
                      {step.description}
                    </div>
                  </div>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
