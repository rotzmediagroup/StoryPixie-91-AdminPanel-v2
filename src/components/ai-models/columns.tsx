import { ColumnDef } from "@tanstack/react-table";
import { AIModel } from "@/types"; // Import the AIModel type
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
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
// import { updateAIModelStatus } from "@/lib/firestoreUtils"; // TODO: Implement this function if needed
import { toast } from "@/hooks/use-toast";

// Define columns for the AI Model table
export const aiModelColumns: ColumnDef<AIModel>[] = [
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
  // Model Name Column with Sorting
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Model Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  // Provider Column
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => <div>{row.getValue("provider")}</div>,
  },
  // Version Column
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => <div>{row.getValue("version")}</div>,
  },
  // Active Status Column
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // Max Tokens Column
  {
    accessorKey: "maxTokens",
    header: "Max Tokens",
    cell: ({ row }) => <div>{row.getValue("maxTokens")?.toLocaleString() || "N/A"}</div>,
  },
  // Cost Per Token Column
  {
    accessorKey: "costPerToken",
    header: "Cost/Token",
    cell: ({ row }) => <div>{row.getValue("costPerToken") ? `$${row.getValue("costPerToken")}` : "N/A"}</div>,
  },
  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const model = row.original;
      const isActive = model.active;

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
              onClick={() => navigator.clipboard.writeText(model.id)}
            >
              Copy Model ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert(`Editing model ${model.id} (Not Implemented)`)}>Edit Model</DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => alert(`Toggling status for ${model.id} (Not Implemented)`)}
            >
              {isActive ? "Deactivate Model" : "Activate Model"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => alert(`Deleting model ${model.id} (Not Implemented)`)}>Delete Model</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

