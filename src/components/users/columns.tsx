import { ColumnDef } from "@tanstack/react-table";
import { User, DisplayUserStatus } from "@/types"; // Updated to DisplayUserStatus
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DialogTrigger } from "@/components/ui/dialog"; // Corrected import for DialogTrigger
import { Badge } from "@/components/ui/badge";
import { updateUserStatus } from "@/lib/firestoreUtils"; 
import { toast } from "@/components/ui/use-toast"; // Corrected import path for toast
import { Timestamp } from "firebase/firestore"; // Import Timestamp

import { EditPixieDustDialog } from "./EditPixieDustDialog"; 

// Helper function to format Firestore Timestamp
const formatDate = (timestamp: Timestamp | undefined): string => {
  if (!timestamp || typeof timestamp.toDate !== "function") return "N/A";
  try {
    return timestamp.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Function to handle toggling user active status (replaces ban/unban)
const handleToggleUserActiveStatus = async (userId: string, currentIsActive: boolean | undefined) => {
  const newIsActive = !(currentIsActive === true); // Toggle the boolean value
  const actionText = newIsActive ? "Activating" : "Deactivating";
  const successText = newIsActive ? "activated" : "deactivated";
  
  toast({ title: `${actionText} user...`, description: `Attempting to update status for user ${userId}.` });
  
  // Assuming updateUserStatus can be adapted or a new function is created for isActive
  // For now, let's assume updateUserStatus can handle a boolean for an "isActive" field.
  // This might require a change in firestoreUtils.ts if updateUserStatus expects a string status.
  // For simplicity, we will assume it works or will be adapted.
  // Ideally, a dedicated function like `updateUserIsActive(userId: string, isActive: boolean)` would be better.
  const success = await updateUserStatus(userId, newIsActive ? "active" : "blocked"); // Temporary mapping
  
  if (success) {
    toast({ title: `User ${successText}`, description: `User ${userId} has been successfully ${successText}. Refresh may be needed.` });
  } else {
    toast({ title: `Failed to ${actionText.toLowerCase()} user`, description: `Could not update status for user ${userId}.`, variant: "destructive" });
  }
};

// Define columns for the user table, aligned with the new User type
export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "User ID",
    cell: ({ row }) => <div className="text-xs font-mono truncate max-w-[100px]" title={row.getValue("id")}>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "displayName", // Changed from "name"
    header: "Display Name",
    cell: ({ row }) => <div>{row.getValue("displayName") || "N/A"}</div>,
  },
  {
    accessorKey: "createdAt", // Use Firestore Timestamp
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Registered <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "lastLoginAt", // Use Firestore Timestamp
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Last Login <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("lastLoginAt"))}</div>,
  },
  {
    accessorKey: "pixieDust.purple",
    header: "Purple Dust",
    cell: ({ row }) => {
      const pixieDust = row.original.pixieDust;
      return <div className="text-center">{pixieDust?.purple ?? 0}</div>;
    },
  },
  {
    accessorKey: "pixieDust.gold",
    header: "Gold Dust",
    cell: ({ row }) => {
      const pixieDust = row.original.pixieDust;
      return <div className="text-center">{pixieDust?.gold ?? 0}</div>;
    },
  },
  {
    accessorKey: "isActive", // Use isActive boolean from new User type
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      const displayStatus: DisplayUserStatus = isActive ? "active" : "inactive";
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      if (displayStatus === "inactive") variant = "secondary";
      
      return <Badge variant={variant} className="capitalize">{displayStatus}</Badge>;
    },
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) as boolean;
      const filterValue = value as string[]; // Assuming filter value is an array of strings like ["active", "inactive"]
      const currentStatusString = isActive ? "active" : "inactive";
      return filterValue.includes(currentStatusString);
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.getValue("roles") as string[];
      if (!roles || roles.length === 0) return "N/A";
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map(role => (
            <Badge key={role} variant="outline" className="capitalize">{role}</Badge>
          ))}
        </div>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const isActive = user.isActive;
      const toggleActionText = isActive ? "Deactivate User" : "Activate User";

      return (
        <EditPixieDustDialog user={user} onSuccess={() => { /* TODO: Trigger data refresh */ }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy User ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>View User Details (NYI)</DropdownMenuItem> */}
              {/* <DropdownMenuItem>Edit User (NYI)</DropdownMenuItem> */}
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Pixie Dust</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem 
                className={isActive ? "text-destructive" : "text-green-600"}
                onClick={() => handleToggleUserActiveStatus(user.id, user.isActive)}
              >
                {toggleActionText}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </EditPixieDustDialog>
      );
    },
  },
];

