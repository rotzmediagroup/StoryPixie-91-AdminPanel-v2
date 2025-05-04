import { ColumnDef } from "@tanstack/react-table";
import { Story } from "@/types"; // Import the Story type
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, ExternalLink } from "lucide-react";
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
// import { updateStoryStatus } from "@/lib/firestoreUtils"; // TODO: Implement this function if needed
import { toast } from "@/hooks/use-toast";

// Helper function to format date
const formatDate = (timestamp: any): string => {
  if (!timestamp || !timestamp.toDate) return "N/A";
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

// Define columns for the story table
export const storyColumns: ColumnDef<Story>[] = [
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
  // Story ID Column
  {
    accessorKey: "id",
    header: "Story ID",
    cell: ({ row }) => <div className="text-xs font-mono">{row.getValue("id")}</div>,
  },
  // Title Column with Sorting
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium truncate max-w-xs">{row.getValue("title")}</div>,
  },
  // User ID Column
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => <div className="text-xs font-mono">{row.getValue("userId")}</div>,
  },
  // Kid ID Column
  {
    accessorKey: "kidId",
    header: "Kid ID",
    cell: ({ row }) => <div className="text-xs font-mono">{row.getValue("kidId")}</div>,
  },
  // Created At Column with Sorting
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
  // Status Column
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Story["status"] || "completed"; // Default to completed
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      if (status === "pending" || status === "generating") variant = "outline";
      if (status === "failed") variant = "destructive";
      if (status === "flagged") variant = "secondary"; // Or destructive?
      
      return <Badge variant={variant} className="capitalize">{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const story = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(story.id)}
            >
              Copy Story ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert(`Viewing story ${story.id} (Not Implemented)`)}>View Story Details</DropdownMenuItem>
            {/* Add more actions like Flag/Unflag, Delete, etc. */}
            <DropdownMenuItem className="text-destructive" onClick={() => alert(`Deleting story ${story.id} (Not Implemented)`)}>Delete Story</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

