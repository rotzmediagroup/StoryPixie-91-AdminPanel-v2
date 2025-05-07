import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger, // No longer needed here if controlled externally
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { updateUserPixieDust } from "@/lib/firestoreUtils";
import { toast } from "@/components/ui/use-toast"; // Corrected path from previous step if different

interface EditPixieDustDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; 
}

export function EditPixieDustDialog({ user, open, onOpenChange, onSuccess }: EditPixieDustDialogProps) {
  const [purpleDust, setPurpleDust] = useState<number>(0);
  const [goldDust, setGoldDust] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user.pixieDust) {
      setPurpleDust(user.pixieDust.purple || 0);
      setGoldDust(user.pixieDust.gold || 0);
    } else {
      setPurpleDust(0);
      setGoldDust(0);
    }
  }, [user.pixieDust, open]); // Also re-sync when dialog opens

  const handleSave = async () => {
    setIsLoading(true);
    toast({ title: "Updating Pixie Dust...", description: `Attempting to update dust for ${user.email}.` });

    const success = await updateUserPixieDust(user.id, purpleDust, goldDust);

    setIsLoading(false);
    if (success) {
      toast({ title: "Pixie Dust Updated", description: `Successfully updated dust for ${user.email}.` });
      onOpenChange(false); // Close dialog
      onSuccess?.(); 
    } else {
      toast({ title: "Update Failed", description: "Could not update Pixie Dust.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* DialogTrigger is removed from here; it will be handled by the parent component */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pixie Dust for {user.displayName || user.email}</DialogTitle>
          <DialogDescription>
            Modify the Purple and Gold Pixie Dust balance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`purple-dust-${user.id}`} className="text-right">
              Purple Dust
            </Label>
            <Input
              id={`purple-dust-${user.id}`}
              type="number"
              value={purpleDust}
              onChange={(e) => setPurpleDust(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`gold-dust-${user.id}`} className="text-right">
              Gold Dust
            </Label>
            <Input
              id={`gold-dust-${user.id}`}
              type="number"
              value={goldDust}
              onChange={(e) => setGoldDust(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
              min="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

