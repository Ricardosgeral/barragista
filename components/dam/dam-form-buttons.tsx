import {
  LuEye,
  LuLoader2,
  LuRefreshCcw,
  LuSave,
  LuTrash2,
} from "react-icons/lu";
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
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

interface DamFormButtonsProps {
  damId: string | null;
  damFeature: any | null;
  feature?: string;
  isLoading: boolean;
  isDeleting: boolean;
  handleDelete: (damId: string, damFeature: any) => void;
  handleResetform: () => void;
}

export default function DamFormButtons({
  damId,
  damFeature,
  feature,
  isLoading,
  isDeleting,
  handleDelete,
  handleResetform,
}: DamFormButtonsProps) {
  const router = useRouter();

  return (
    <div className="flex w-full items-center">
      <div className="flex w-full items-center justify-between">
        {/* delete and refresh Buttons */}
        <div className="flex justify-start gap-4">
          {damId && !!damFeature && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  type="button"
                  disabled={isDeleting || isLoading}
                >
                  {isDeleting ? (
                    <>
                      <LuLoader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <LuTrash2 className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. <br />
                    This will permanently remove
                    {feature === "identification"
                      ? " ALL DATA of this dam "
                      : " the data of this dam feature "}
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(damId, damFeature)}
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
            <LuRefreshCcw className="" />
          </Button>
        </div>

        {/* view Dam and save buttons */}
        <div className="flex justify-end gap-4">
          {/* view */}
          {damId && !!damFeature && (
            <Button
              variant="default"
              onClick={() => {
                router.push(`/dam-details/${damId}`);
              }}
            >
              <LuEye className="h-4 w-4" />
            </Button>
          )}

          {/* save button */}
          {damId && !!damFeature ? (
            <Button type="submit" disabled={isLoading} variant="success">
              {isLoading ? (
                <LuLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LuSave className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <LuLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LuSave className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
