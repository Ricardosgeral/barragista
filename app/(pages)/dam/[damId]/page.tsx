import AddDamForm from "@/components/dam/add-dam-form";
import AddDamLocationForm from "@/components/dam/add-location-form";
import AddDamProjectForm from "@/components/dam/add-project-form";

import { getDamById } from "@/data/dam/get-dam-by-id";
import { getDamFeatureByDamId } from "@/data/dam/get-dam-feature-by-dam-id";
import { currentUser } from "@/lib/auth";

interface DamProps {
  params: { damId: string };
}

export default async function Dam({ params }: DamProps) {
  const user = await currentUser(); // uses auth from lib for rendering in server components
  console.log(user);
  if (!user) return <div>Not authenticated...</div>;

  const dam = await getDamById(params.damId);

  const damLocationData = await getDamFeatureByDamId("location", params.damId);
  const damProjetData = await getDamFeatureByDamId("project", params.damId);

  return (
    <div>
      <AddDamForm dam={dam} />
      <AddDamLocationForm
        damId={dam?.id || null}
        damLocation={damLocationData || null}
      />
      <AddDamProjectForm
        damId={dam?.id || null}
        damProject={damProjetData || null}
      />
    </div>
  );
}
