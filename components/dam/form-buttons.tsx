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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface PageProps {
  damId: string | null;
  damFeature: any | null;
  isLoading: boolean;
  isDeleting: boolean;
  handleDelete: (damId: string, damFeature: any) => void;
  handleResetform: () => void;
}

export default function FormButtons({
  damId,
  damFeature,
  isLoading,
  isDeleting,
  handleDelete,
  handleResetform,
}: PageProps) {
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
                    This will permanently remove the data from our servers.
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

        {/* view Dam and save buttons button */}
        <div className="flex justify-end gap-4">
          {damId && !!damFeature && (
            <>
              <Button
                variant="default"
                onClick={() => {
                  router.push(`/dam-details/${damId}`);
                }}
              >
                <LuEye className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* create/update Dam Buttons */}
          {damId && !!damFeature ? (
            <Button type="submit" disabled={isLoading} variant="success">
              {isLoading ? (
                <>
                  <LuLoader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <LuSave className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LuLoader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <LuSave className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
