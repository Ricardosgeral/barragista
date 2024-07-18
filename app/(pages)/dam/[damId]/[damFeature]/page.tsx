import AddDamLocationForm from "@/components/dam/add-location-form";
import AddDamProjectForm from "@/components/dam/add-project-form";
import AddDamHydrologyForm from "@/components/dam/add-hydrology-form";

import { currentUser } from "@/lib/auth";
import { isCuid } from "@/app/utils/isCuid";
import { redirect } from "next/navigation";
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
import { getDamFeatureByDamId } from "@/data/dam/get-dam-feature-by-dam-id";
import AddDamForm from "@/components/dam/add-dam-form";
import AddDamReservoirForm from "@/components/dam/add-reservoir-form";
import AddDamBodyForm from "@/components/dam/add-body-form";
import AddDamFoundationForm from "@/components/dam/add-foundation-form";
import AddDamDischargeForm from "@/components/dam/add-discharge-form";
import AddDamSpillwayForm from "@/components/dam/add-spillway-form";
import AddDamEnvironmentalForm from "@/components/dam/add-environmental-form";
import AddDamRiskForm from "@/components/dam/add-risk-form";
import AddDamHydropowerForm from "@/components/dam/add-hydropower-form";
import { getDamById } from "@/data/dam/get-dam-by-id";
import { FormStepsNav } from "@/components/dam/form-steps-nav";

const componentMap: { [key: string]: React.ComponentType<any> } = {
  identification: AddDamForm,
  location: AddDamLocationForm,
  project: AddDamProjectForm,
  hydrology: AddDamHydrologyForm,
  reservoir: AddDamReservoirForm,
  body: AddDamBodyForm,
  foundation: AddDamFoundationForm,
  discharge: AddDamDischargeForm,
  spillway: AddDamSpillwayForm,
  hydropower: AddDamHydropowerForm,
  environmental: AddDamEnvironmentalForm,
  risk: AddDamRiskForm,
};

interface DamFeatureProps {
  params: { damId: string; damFeature: string };
}

export default async function DamFeaturePage({ params }: DamFeatureProps) {
  const damId: string = params.damId;
  const damFeature: String = params.damFeature;

  const user = await currentUser(); // uses auth from lib for rendering in server components
  if (!user) redirect("/auth/register");

  if (!isCuid(damId) && damId !== "new") redirect("/dam");

  // if there is a recognized id in dam it must exists
  if (!(isCuid(damId) || damFeature === "identification"))
    redirect("/dam/new/identification");

  const damData: Dam | null = await getDamById(damId);

  const damLocationData: DamLocation[] = await getDamFeatureByDamId(
    "location",
    damId,
  );
  const damProjectData: DamProject[] = await getDamFeatureByDamId(
    "project",
    damId,
  );
  const damHydrologyData: DamHydrology[] = await getDamFeatureByDamId(
    "hydrology",
    damId,
  );
  const damReservoirData: DamReservoir[] = await getDamFeatureByDamId(
    "reservoir",
    damId,
  );

  const damBodyData: DamBody[] = await getDamFeatureByDamId("body", damId);
  const damFoundationData: DamFoundation[] = await getDamFeatureByDamId(
    "foundation",
    damId,
  );

  const damDischargeData: DamDischarge[] = await getDamFeatureByDamId(
    "discharge",
    damId,
  );

  const damSpillwayData: DamSpillway[] = await getDamFeatureByDamId(
    "spillway",
    damId,
  );

  const damHydropowerData: DamHydropower[] = await getDamFeatureByDamId(
    "hydropower",
    damId,
  );

  const damEnvironmentalData: DamEnvironmental[] = await getDamFeatureByDamId(
    "environmental",
    damId,
  );

  const damRiskData: DamRisk[] = await getDamFeatureByDamId("risk", damId);

  // Find the component based on damFeature
  const SelectedComponent = componentMap[damFeature as any];

  // Prepare props dynamically
  const props = {
    ...(damFeature === "identification" && {
      dam: damData ? damData : null,
    }),
    ...(damFeature !== "identification" && { damId }),
    ...(damFeature === "location" && {
      damLocation: damLocationData ? damLocationData[0] : null,
    }),
    ...(damFeature === "project" && {
      damProject: damProjectData ? damProjectData[0] : null,
    }),
    ...(damFeature === "hydrology" && {
      damHydrology: damHydrologyData ? damHydrologyData[0] : null,
    }),
    ...(damFeature === "reservoir" && {
      damReservoir: damReservoirData ? damReservoirData[0] : null,
    }),
    ...(damFeature === "body" && {
      damBody: damBodyData ? damBodyData[0] : null,
    }),
    ...(damFeature === "foundation" && {
      damFoundation: damFoundationData ? damFoundationData[0] : null,
    }),
    ...(damFeature === "discharge" && {
      damDischarge: damDischargeData ? damDischargeData[0] : null,
    }),
    ...(damFeature === "spillway" && {
      damSpillway: damSpillwayData ? damSpillwayData[0] : null,
    }),
    ...(damFeature === "hydropower" && {
      damHydropower: damHydropowerData ? damHydropowerData[0] : null,
    }),
    ...(damFeature === "environmental" && {
      damEnvironmental: damEnvironmentalData ? damEnvironmentalData[0] : null,
    }),
    ...(damFeature === "risk" && {
      damRisk: damRiskData ? damRiskData[0] : null,
      damBody: damBodyData ? damBodyData[0] : null,
      damReservoir: damReservoirData ? damReservoirData[0] : null,
    }),
  };

  return (
    <div className="flex justify-center space-x-8">
      <FormStepsNav
        damId={damId}
        damData={damData}
        damLocationData={damLocationData}
        damProjectData={damProjectData}
        damHydrologyData={damHydrologyData}
        damReservoirData={damReservoirData}
        damBodyData={damBodyData}
        damFoundationData={damFoundationData}
        damDischargeData={damDischargeData}
        damSpillwayData={damSpillwayData}
        damHydropowerData={damHydropowerData}
        damEnvironmentalData={damEnvironmentalData}
        damRiskData={damRiskData}
        // damFilesData={damFilesData}
      />
      <main>
        {SelectedComponent ? <SelectedComponent {...props} /> : <p>TODO</p>}
      </main>
    </div>
  );
}
