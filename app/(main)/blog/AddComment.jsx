import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Loader2 } from "lucide-react";

export default function AddComment({
  open,
  handleClose,
  handleSubmit,
  onSubmitLogic,
  children,
  postLoading,
  title,
}) {
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmitLogic)}
            id="subscription-form"
            className="space-y-4"
          >
            {children}
          </form>
        </DialogContent>
        <DialogActions>
          <button
            className="w-full  bg-background text-primary font-bold py-2 rounded-lg hover:shadow-lg transition-shadow "
            onClick={handleClose}
            disabled={postLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="subscription-form"
            disabled={postLoading}
            className="w-full justify-center py-2 bg-primary text-background font-bold rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {postLoading && <Loader2 size={16} className="animate-spin" />}
            {postLoading ? "Adding..." : "Add"}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
