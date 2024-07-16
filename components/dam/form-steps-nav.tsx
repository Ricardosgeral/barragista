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
      <div className="mb-4 hidden font-bold sm:flex">
        <div className="flex items-end">
          <div className="pr-2 text-foreground/30">Dam</div>
          <div className="text-lg text-yellow-500">
            {damData && damData.name}
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
                // when there is no dam created yet
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex cursor-default items-center gap-x-2">
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-lg text-xs",
                            current_step === normalizedStepPath
                              ? "size-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500 to-yellow-400 font-bold text-background shadow-xl"
                              : "border bg-foreground/10 text-foreground/30",
                          )}
                        >
                          {step.id}
                        </div>
                        <div
                          className={cn(
                            "flex items-center justify-center",
                            current_step === normalizedStepPath
                              ? "font-bold text-yellow-500"
                              : "text-foreground/30",
                          )}
                        >
                          {step.description}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Dam identification required</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                // if there is a dam created
                <Link href={`/dam/${damId}/${step.path}`}>
                  <div className="flex items-center gap-x-2 text-background">
                    <div
                      className={cn(
                        "relative flex h-6 w-6 items-center justify-center rounded-lg text-xs",
                        current_step === normalizedStepPath
                          ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500 to-yellow-400 font-bold text-background"
                          : "bg-foreground/30 text-background/90",
                        hasData && "shadow-xxl bg-foreground/50",
                      )}
                    >
                      {step.id}
                      {hasData && (
                        <LuBadgeCheck className="absolute -right-1 -top-1 rounded-full bg-background text-emerald-500" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "hidden sm:flex sm:items-center sm:justify-center",
                        current_step === normalizedStepPath
                          ? "font-bold text-yellow-500"
                          : "text-foreground/50",
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
