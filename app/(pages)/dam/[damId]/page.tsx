import { isCuid } from "@/app/utils/isCuid";
import AddDamForm from "@/components/dam/add-dam-form";
import AddDamLocationForm from "@/components/dam/add-location-form";
import AddDamHydrologyForm from "@/components/dam/add-hydrology-form";
import AddDamProjectForm from "@/components/dam/add-project-form";
import AddDamReservoirForm from "@/components/dam/add-reservoir-form";

import { getDamById } from "@/data/dam/get-dam-by-id";
import { getDamFeatureByDamId } from "@/data/dam/get-dam-feature-by-dam-id";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  DamBody,
  DamBtDischarge,
  DamEnviron,
  DamFoundation,
  DamHydrology,
  DamHydropower,
  DamLocation,
  DamProject,
  DamReservoir,
  DamRisk,
  DamSpillway,
} from "@prisma/client";
import AddDamBodyForm from "@/components/dam/add-body-form";
import AddDamFoundationForm from "@/components/dam/add-foundation-form";
import AddDamBtDischargeForm from "@/components/dam/add-discharge-form";
import AddDamSpillwayForm from "@/components/dam/add-spillway-form";
import AddDamHydropowerForm from "@/components/dam/add-hydropower-form";
import AddDamEnvironForm from "@/components/dam/add-environmental-form";
import AddDamRiskForm from "@/components/dam/add-risk-form";

interface DamProps {
  params: { damId: string };
}
// In URL /dam/123, the params object will be { damId: '123' }

export default async function Dam({ params }: DamProps) {
  const user = await currentUser(); // uses auth from lib for rendering in server components

  // if there is a recognized id in dam it must exists
  const damId = params.damId;
  if (!(isCuid(damId) || damId === "new")) {
    redirect("/dam/new");
  }

  if (!user) return <div>Not authenticated...</div>;

  const dam = await getDamById(damId);

  if (!dam && isCuid(damId))
    return <div>There is no dam with provided id...</div>;

  const damLocationData: DamLocation[] | null = await getDamFeatureByDamId(
    "location",
    damId,
  );
  const damProjectData: DamProject[] | null = await getDamFeatureByDamId(
    "project",
    damId,
  );
  const damHydrologyData: DamHydrology[] | null = await getDamFeatureByDamId(
    "hydrology",
    damId,
  );
  const damReservoirData: DamReservoir[] | null = await getDamFeatureByDamId(
    "reservoir",
    damId,
  );

  const damBodyData: DamBody[] | null = await getDamFeatureByDamId(
    "body",
    damId,
  );
  const damFoundationData: DamFoundation[] | null = await getDamFeatureByDamId(
    "foundation",
    damId,
  );

  const damBtDischargeData: DamBtDischarge[] | null =
    await getDamFeatureByDamId("bottom_discharge", damId);

  const damSpillwayData: DamSpillway[] | null = await getDamFeatureByDamId(
    "spillway",
    damId,
  );

  const damHydropowerData: DamHydropower[] | null = await getDamFeatureByDamId(
    "hydropower",
    damId,
  );

  const damEnvironData: DamEnviron[] | null = await getDamFeatureByDamId(
    "environmental",
    damId,
  );

  const damRiskData: DamRisk[] | null = await getDamFeatureByDamId(
    "risk",
    damId,
  );

  return (
    <div className="flex flex-col gap-y-8">
      <AddDamForm dam={dam} />
      {isCuid(damId) && (
        <div className="">
          <AddDamLocationForm
            damId={damId}
            damLocation={damLocationData ? damLocationData[0] : null}
          />

          <AddDamProjectForm
            damId={damId}
            damProject={damProjectData ? damProjectData[0] : null}
          />

          <AddDamHydrologyForm
            damId={damId}
            damHydrology={damHydrologyData ? damHydrologyData[0] : null}
          />

          <AddDamReservoirForm
            damId={damId}
            damReservoir={damReservoirData ? damReservoirData[0] : null}
          />

          <AddDamBodyForm
            damId={damId}
            damBody={damBodyData ? damBodyData[0] : null}
          />

          <AddDamFoundationForm
            damId={damId}
            damFoundation={damFoundationData ? damFoundationData[0] : null}
          />

          <AddDamBtDischargeForm
            damId={damId}
            damBtDischarge={damBtDischargeData ? damBtDischargeData[0] : null}
          />

          <AddDamSpillwayForm
            damId={damId}
            damSpillway={damSpillwayData ? damSpillwayData[0] : null}
          />

          <AddDamHydropowerForm
            damId={damId}
            damHydropower={damHydropowerData ? damHydropowerData[0] : null}
          />
          <AddDamEnvironForm
            damId={damId}
            damEnviron={damEnvironData ? damEnvironData[0] : null}
          />
          <AddDamRiskForm
            damId={damId}
            damRisk={damRiskData ? damRiskData[0] : null}
          />
        </div>
      )}
    </div>
  );
}
