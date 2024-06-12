import AddDamForm from "@/components/dam/add-dam-form";
import { getDamById } from "@/data/dam/get-dam-by-id";
import { currentUser } from "@/lib/auth";

interface DamProps {
  params: { damId: string };
}

export default async function Dam({ params }: DamProps) {
  const user = await currentUser(); // uses auth from lib for rendering in server components
  if (!user) return <div>Not authenticated...</div>;

  const dam = await getDamById(params.damId);
  //console.log(dam);

  return (
    <div>
      <AddDamForm dam={dam} />
    </div>
  );
}
