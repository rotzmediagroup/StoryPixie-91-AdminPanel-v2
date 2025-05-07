import React, { useState } from "react"; // Added useState
import { ColumnDef } from "@tanstack/react-table";
import { User, DisplayUserStatus } from "@/types";
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
// DialogTrigger is removed as we will control the dialog state manually
import { Badge } from "@/components/ui/badge";
import { updateUserStatus } from "@/lib/firestoreUtils"; 
import { toast } from "@/components/ui/use-toast";
import { Timestamp } from "firebase/firestore";

import { EditPixieDustDialog } from "./EditPixieDustDialog"; 

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

const handleToggleUserActiveStatus = async (userId: string, currentIsActive: boolean | undefined) => {
  const newIsActive = !(currentIsActive === true);
  const actionText = newIsActive ? "Activating" : "Deactivating";
  const successText = newIsActive ? "activated" : "deactivated";
  
  toast({ title: `${actionText} user...`, description: `Attempting to update status for user ${userId}.` });
  
  const success = await updateUserStatus(userId, newIsActive ? "active" : "blocked"); 
  
  if (success) {
    toast({ title: `User ${successText}`, description: `User ${userId} has been successfully ${successText}. Refresh may be needed.` });
    // TODO: Ideally, trigger a data refresh here instead of relying on manual refresh
  } else {
    toast({ title: `Failed to ${actionText.toLowerCase()} user`, description: `Could not update status for user ${userId}.`, variant: "destructive" });
  }
};

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
    filterFn: (row, id, value) => {
      const email = row.getValue(id) as string;
      return email.toLowerCase().includes((value as string).toLowerCase());
    },
  },
  {
    accessorKey: "displayName",
    header: "Display Name",
    cell: ({ row }) => <div>{row.getValue("displayName") || "N/A"}</div>,
    filterFn: (row, id, value) => {
      const displayName = row.getValue(id) as string || "";
      return displayName.toLowerCase().includes((value as string).toLowerCase());
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Registered <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "lastLoginAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Last Login <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("lastLoginAt"))}</div>,
  },
  {
    accessorKey: "pixieDust.purple",
    header: () => <div className="text-center">Purple Dust</div>, // Centered header
    cell: ({ row }) => {
      const pixieDust = row.original.pixieDust;
      return <div className="text-center">{pixieDust?.purple ?? 0}</div>;
    },
  },
  {
    accessorKey: "pixieDust.gold",
    header: () => <div className="text-center">Gold Dust</div>, // Centered header
    cell: ({ row }) => {
      const pixieDust = row.original.pixieDust;
      return <div className="text-center">{pixieDust?.gold ?? 0}</div>;
    },
  },
  {
    accessorKey: "isActive",
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
      const filterValue = value as string[];
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
    cell: function Cell({ row }) { // Changed to a function component to use hooks
      const user = row.original;
      const isActive = user.isActive;
      const toggleActionText = isActive ? "Deactivate User" : "Activate User";
      const [isPixieDustDialogOpen, setIsPixieDustDialogOpen] = useState(false);

      return (
        <>
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
              <DropdownMenuItem onSelect={() => setIsPixieDustDialogOpen(true)}>
                Edit Pixie Dust
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={isActive ? "text-destructive" : "text-green-600"}
                onClick={() => handleToggleUserActiveStatus(user.id, user.isActive)}
              >
                {toggleActionText}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditPixieDustDialog 
            user={user} 
            open={isPixieDustDialogOpen} 
            onOpenChange={setIsPixieDustDialogOpen} 
            onSuccess={() => {
              // TODO: Implement data refresh for the table after successful update
              // This might involve refetching users or updating the local state
              console.log("Pixie dust updated, table refresh needed.");
            }}
          />
        </>
      );
    },
  },
];

