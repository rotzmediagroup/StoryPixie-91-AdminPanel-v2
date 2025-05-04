import { ColumnDef } from "@tanstack/react-table";
import { Story } from "@/types"; // Import the Story type
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Eye, Check, X, Trash2 } from "lucide-react";
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
// import { updateStoryStatus } from "@/lib/firestoreUtils"; // TODO: Implement this function
import { toast } from "@/hooks/use-toast";

// Helper function to format date (reuse from storyColumns or move to utils)
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

// Define columns for the flagged stories table
export const flaggedStoryColumns: ColumnDef<Story>[] = [
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
  // Created At Column with Sorting
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Flagged At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>, // Assuming createdAt is when it was flagged or created
  },
  // Status Column (Should always be 'flagged' here)
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <Badge variant="secondary" className="capitalize">{row.getValue("status")}</Badge>;
    },
  },
  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const story = row.original;

      const handleApprove = async () => {
        // TODO: Implement updateStoryStatus(story.id, 'completed')
        alert(`Approving story ${story.id} (Not Implemented)`);
        toast({ title: "Story Approved", description: `Story "${story.title}" marked as completed.` });
        // TODO: Refresh data
      };

      const handleReject = async () => {
        // TODO: Implement updateStoryStatus(story.id, 'rejected') or delete
        alert(`Rejecting story ${story.id} (Not Implemented)`);
        toast({ title: "Story Rejected", description: `Story "${story.title}" has been rejected/removed.`, variant: "destructive" });
        // TODO: Refresh data
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Moderation</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => alert(`Viewing story ${story.id} (Not Implemented)`)}>
              <Eye className="mr-2 h-4 w-4" /> View Story
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleApprove} className="text-green-600">
              <Check className="mr-2 h-4 w-4" /> Approve Story
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReject} className="text-destructive">
              <X className="mr-2 h-4 w-4" /> Reject / Remove Story
            </DropdownMenuItem>
            {/* Optionally add delete action */}
            {/* <DropdownMenuItem className="text-destructive" onClick={() => alert(`Deleting story ${story.id} (Not Implemented)`)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

