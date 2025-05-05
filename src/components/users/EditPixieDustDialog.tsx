import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { updateUserPixieDust } from "@/lib/firestoreUtils";
import { toast } from "@/hooks/use-toast";

interface EditPixieDustDialogProps {
  user: User;
  onSuccess?: () => void; // Optional callback on successful update
}

export function EditPixieDustDialog({ user, onSuccess }: EditPixieDustDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [purpleDust, setPurpleDust] = useState<number>(0);
  const [goldDust, setGoldDust] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user.pixieDust) {
      setPurpleDust(user.pixieDust.purple || 0);
      setGoldDust(user.pixieDust.gold || 0);
    }
  }, [user.pixieDust]);

  const handleSave = async () => {
    setIsLoading(true);
    toast({ title: "Updating Pixie Dust...", description: `Attempting to update dust for ${user.email}.` });

    const success = await updateUserPixieDust(user.id, purpleDust, goldDust);

    setIsLoading(false);
    if (success) {
      toast({ title: "Pixie Dust Updated", description: `Successfully updated dust for ${user.email}.` });
      setIsOpen(false);
      onSuccess?.(); // Call success callback if provided
    } else {
      toast({ title: "Update Failed", description: "Could not update Pixie Dust.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* This button is just a placeholder trigger; the actual trigger will be in the table actions */}
        <Button variant="outline" className="hidden">Edit Dust</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pixie Dust</DialogTitle>
          <DialogDescription>
            Modify the Purple and Gold Pixie Dust balance for {user.email}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purple-dust" className="text-right">
              Purple Dust
            </Label>
            <Input
              id="purple-dust"
              type="number"
              value={purpleDust}
              onChange={(e) => setPurpleDust(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gold-dust" className="text-right">
              Gold Dust
            </Label>
            <Input
              id="gold-dust"
              type="number"
              value={goldDust}
              onChange={(e) => setGoldDust(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
              min="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
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

