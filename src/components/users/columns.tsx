import { ColumnDef } from "@tanstack/react-table";
import { User, UserStatus } from "@/types"; // Assuming User type is defined in @/types
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
import { Badge } from "@/components/ui/badge";
import { updateUserStatus } from "@/lib/firestoreUtils"; // Import the update function
import { toast } from "@/hooks/use-toast"; // Import toast for feedback

import { EditPixieDustDialog } from "./EditPixieDustDialog"; // Import the dialog

// Helper function to format date
const formatDate = (timestamp: any): string => {
  if (!timestamp || !timestamp.toDate) return "N/A";
  try {
    return timestamp.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Function to handle banning a user
const handleBanUser = async (userId: string, currentStatus: UserStatus | undefined) => {
  const newStatus: UserStatus = currentStatus === "blocked" ? "active" : "blocked"; // Toggle between blocked and active
  const actionText = newStatus === "blocked" ? "Banning" : "Unbanning";
  const successText = newStatus === "blocked" ? "banned" : "unbanned";
  
  toast({ title: `${actionText} user...`, description: `Attempting to update status for user ${userId}.` });
  
  const success = await updateUserStatus(userId, newStatus);
  
  if (success) {
    toast({ title: `User ${successText}`, description: `User ${userId} has been successfully ${successText}. Refresh may be needed.` });
    // TODO: Ideally, update the table state directly instead of requiring refresh
  } else {
    toast({ title: `Failed to ${actionText.toLowerCase()} user`, description: `Could not update status for user ${userId}.`, variant: "destructive" });
  }
};

// Define columns for the user table
export const userColumns: ColumnDef<User>[] = [
  // Select Checkbox Column
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
  // User ID Column
  {
    accessorKey: "id",
    header: "User ID",
    cell: ({ row }) => <div className="text-xs font-mono">{row.getValue("id")}</div>,
  },
  // Email Column with Sorting
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  // Name Column
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name") || "N/A"}</div>,
  },
  // Registration Date Column with Sorting
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registered
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
  // Purple Pixie Dust Column
  {
    accessorKey: "pixieDust.purple",
    header: "Purple Dust",
    cell: ({ row }) => {
      const pixieDust = row.original.pixieDust;
      return <div>{pixieDust?.purple ?? 0}</div>; // Display 0 if undefined
    },
  },
  // Gold Pixie Dust Column
  {
    accessorKey: "pixieDust.gold",
    header: "Gold Dust",
    cell: ({ row }) => {
      const pixieDust = row.original.pixieDust;
      return <div>{pixieDust?.gold ?? 0}</div>; // Display 0 if undefined
    },
  },
  // Status Column (Example - needs actual status field in User type)
  {
    accessorKey: "status", // Assuming a 'status' field exists (e.g., 'active', 'inactive', 'banned')
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus || "active"; // Default to active if no status
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      if (status === "suspended") variant = "secondary"; // Use secondary for suspended
      if (status === "blocked") variant = "destructive"; // Use destructive for blocked/banned
      if (status === "pending") variant = "outline"; // Use outline for pending
      
      return <Badge variant={variant} className="capitalize">{status}</Badge>;
    },
    // Enable filtering for status
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const currentStatus = user.status || "active";
      const banActionText = currentStatus === "blocked" ? "Unban User" : "Ban User";

      return (
        <EditPixieDustDialog user={user} onSuccess={() => { /* Optional: Trigger data refresh */ }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert(`Viewing details for ${user.id} (Not Implemented)`)}>View User Details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert(`Editing user ${user.id} (Not Implemented)`)}>Edit User</DropdownMenuItem>
              {/* Wrap the Edit Pixie Dust item in the Dialog Trigger */}
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Pixie Dust</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem 
                className={currentStatus === "blocked" ? "text-green-600" : "text-destructive"}
                onClick={() => handleBanUser(user.id, currentStatus)}
              >
                {banActionText}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </EditPixieDustDialog>
      );
    },
  },
];

