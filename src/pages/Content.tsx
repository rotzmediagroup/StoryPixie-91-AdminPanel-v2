import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Plus, 
  Filter, 
  BookOpen, 
  MoreVertical,
  Download,
  UploadCloud,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Loader2, // Added Loader icon
  AlertCircle // Added Alert icon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllStories, updateStoryStatus } from '@/lib/firestoreUtils'; // Import real data fetching
import { Story } from '@/types'; // Import Story type
import { format } from 'date-fns'; // For formatting dates

// Mock data for templates (keep for now, can replace later)
const mockTemplates = [
  {
    id: 't-001',
    name: 'Adventure Story',
    description: 'Template for creating adventure stories for kids aged 5-8',
    usage: 142,
    lastUsed: '2024-04-30',
    categories: ['Adventure', 'Action']
  },
  // ... other templates
];

const Content = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedStories = await getAllStories();
        setStories(fetchedStories);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
        setError("Failed to load stories. Please check console or try again later.");
        toast({
          title: "Error fetching stories",
          description: err instanceof Error ? err.message : "An unknown error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, [toast]); // Added toast to dependency array

  const refreshStories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStories = await getAllStories();
      setStories(fetchedStories);
      toast({ title: "Stories refreshed" });
    } catch (err) {
      console.error("Failed to refresh stories:", err);
      setError("Failed to refresh stories. Please check console or try again later.");
      toast({
        title: "Error refreshing stories",
        description: err instanceof Error ? err.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    (story.prompt && story.prompt.toLowerCase().includes(searchValue.toLowerCase())) // Search prompt too
  );
  
  const filteredTemplates = mockTemplates.filter(template => 
    template.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    template.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  // --- Action Handlers --- 
  // TODO: Implement actual logic for edit, delete, view, bulk actions
  // For delete, need to call a firestoreUtils function (to be created)
  // For edit/view, might need dialogs or separate pages

  const handleDelete = async (story: Story) => {
    // TODO: Implement deleteStory in firestoreUtils and call it here
    // Need userId, profileId, storyId
    console.log("Attempting to delete:", story);
    toast({
      title: "Delete action (Not Implemented)",
      description: `Deletion for story ${story.id} needs implementation.`,
      variant: "destructive"
    });
    // Example: await deleteStory(story.userId, story.profileId, story.id);
    // await refreshStories(); 
  };

  const handleEdit = (story: Story) => {
    // TODO: Implement edit functionality (e.g., open a dialog)
    console.log("Attempting to edit:", story);
    toast({
      title: "Edit action (Not Implemented)",
      description: `Editing for story ${story.id} needs implementation.`,
    });
  };

  const handleView = (story: Story) => {
    // TODO: Implement view functionality (e.g., open a dialog/modal)
    console.log("Attempting to view:", story);
    toast({
      title: "View action (Not Implemented)",
      description: `Viewing details for story ${story.id} needs implementation.`,
    });
  };

  const handleBulkAction = (action: string) => {
    // TODO: Implement bulk actions (publish, archive, delete, export)
    toast({
      title: `Bulk ${action} (Not Implemented)`,
      description: `${action} on ${selectedStories.length} items needs implementation.`,
    });
    // Potentially loop through selectedStories and call individual action functions
    // setSelectedStories([]); // Clear selection after action
  };

  // --- Selection Handlers --- 
  const toggleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedStories(filteredStories.map(story => story.id));
    } else {
      setSelectedStories([]);
    }
  };

  const toggleSelectStory = (id: string) => {
    setSelectedStories(prev => 
      prev.includes(id) ? prev.filter(storyId => storyId !== id) : [...prev, id]
    );
  };

  // --- UI Helpers --- 
  const getStatusBadge = (status: Story['status']) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'pending':
      case 'generating':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Generating</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'flagged':
         return <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 text-black">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp || !timestamp.toDate) {
      return 'N/A';
    }
    try {
      return format(timestamp.toDate(), 'yyyy-MM-dd HH:mm');
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">
            Manage stories, sequels, character sets, and templates.
          </p>
        </div>
        {/* TODO: Add Create New functionality later */}
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button> */}
      </div>

      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-4"> {/* Adjusted grid columns */}
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="sequels">Sequels</TabsTrigger> {/* Added Sequels Tab */}
          <TabsTrigger value="characters">Character Sets</TabsTrigger> {/* Added Character Sets Tab */}
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* --- Stories Tab --- */}
        <TabsContent value="stories" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="flex items-center space-x-2 flex-grow">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search stories by title or prompt..." 
                className="flex-grow"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={refreshStories} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Filter className="h-4 w-4 mr-1" />} Refresh
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={selectedStories.length === 0}>
                  <Button variant="outline" size="sm" disabled={selectedStories.length === 0}>
                    Bulk Actions ({selectedStories.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* TODO: Implement bulk actions */}
                  <DropdownMenuItem onClick={() => handleBulkAction('flag')} className="text-yellow-600">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>Flag</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('unflag')} className="text-green-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>Unflag</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={filteredStories.length > 0 && selectedStories.length === filteredStories.length}
                      indeterminate={selectedStories.length > 0 && selectedStories.length < filteredStories.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">User ID</TableHead>
                  <TableHead className="hidden md:table-cell">Profile ID</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin opacity-50" />
                      <p className="mt-2 text-lg font-medium">Loading Stories...</p>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-red-600">
                      <AlertCircle className="mx-auto h-12 w-12 opacity-50" />
                      <p className="mt-2 text-lg font-medium">Error Loading Stories</p>
                      <p className="text-sm">{error}</p>
                      <Button onClick={refreshStories} variant="outline" size="sm" className="mt-4">
                        Try Again
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : filteredStories.length > 0 ? (
                  filteredStories.map(story => (
                    <TableRow key={story.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedStories.includes(story.id)} 
                          onCheckedChange={() => toggleSelectStory(story.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{story.title}</div>
                        <div className="text-sm text-muted-foreground md:hidden">User: {story.userId}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs">{story.userId}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs">{story.profileId}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(story.status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          {formatDate(story.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleView(story)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(story)}
                            title="Edit Story (Not Implemented)"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Delete Story">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Story</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{story.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(story)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-lg font-medium">No stories found</p>
                      <p className="text-sm text-muted-foreground">
                        No stories match your search criteria, or no stories have been generated yet.
                      </p>
                      {/* <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Story (Manual?)
                      </Button> */}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* --- Sequels Tab --- */}
        <TabsContent value="sequels" className="space-y-4">
          {/* TODO: Implement UI for Sequels similar to Stories, using getAllSequels */}
          <Card>
            <CardHeader>
              <CardTitle>Sequels</CardTitle>
              <CardDescription>Sequels generated by users.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Sequel management UI will be implemented here, fetching data using `getAllSequels`.</p>
              {/* Placeholder for table/list */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Character Sets Tab --- */}
        <TabsContent value="characters" className="space-y-4">
          {/* TODO: Implement UI for Character Sets, using getAllCharacterSets */}
          <Card>
            <CardHeader>
              <CardTitle>Character Sets</CardTitle>
              <CardDescription>Character sets created by users across all profiles.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Character set management UI will be implemented here, fetching data using `getAllCharacterSets`.</p>
              {/* Placeholder for table/list */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Templates Tab --- */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates..." 
              className="flex-1"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{template.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(template.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(template.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Template duplicated" })}>
                          <UploadCloud className="mr-2 h-4 w-4" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(template.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="text-xs pt-1">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Usage: {template.usage}</span>
                    <span>Last Used: {template.lastUsed}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.categories.map(cat => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Content;

