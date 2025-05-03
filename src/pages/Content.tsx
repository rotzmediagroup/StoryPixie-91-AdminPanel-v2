import React, { useState } from 'react';
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
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for stories
const mockStories = [
  { 
    id: 's-001', 
    title: 'The Magic Forest', 
    author: 'AI Assistant', 
    status: 'published', 
    category: 'Adventure',
    createdAt: '2024-04-15',
    readCount: 1245,
    rating: 4.8,
  },
  { 
    id: 's-002', 
    title: 'Space Explorer Journey', 
    author: 'AI Assistant', 
    status: 'draft', 
    category: 'Sci-Fi',
    createdAt: '2024-04-28',
    readCount: 0,
    rating: 0,
  },
  { 
    id: 's-003', 
    title: 'The Friendly Dragon', 
    author: 'AI Assistant', 
    status: 'review', 
    category: 'Fantasy',
    createdAt: '2024-04-22',
    readCount: 352,
    rating: 4.2,
  },
  { 
    id: 's-004', 
    title: 'Underwater Adventures', 
    author: 'AI Assistant', 
    status: 'published', 
    category: 'Educational',
    createdAt: '2024-04-01',
    readCount: 2876,
    rating: 4.9,
  },
  { 
    id: 's-005', 
    title: 'Dinosaur Friends', 
    author: 'AI Assistant', 
    status: 'published', 
    category: 'Educational',
    createdAt: '2024-03-18',
    readCount: 3254,
    rating: 4.7,
  }
];

// Mock data for templates
const mockTemplates = [
  {
    id: 't-001',
    name: 'Adventure Story',
    description: 'Template for creating adventure stories for kids aged 5-8',
    usage: 142,
    lastUsed: '2024-04-30',
    categories: ['Adventure', 'Action']
  },
  {
    id: 't-002',
    name: 'Educational Story',
    description: 'Template for creating educational stories about animals and nature',
    usage: 98,
    lastUsed: '2024-04-28',
    categories: ['Educational', 'Nature']
  },
  {
    id: 't-003',
    name: 'Bedtime Story',
    description: 'Short, calming stories perfect for bedtime reading',
    usage: 203,
    lastUsed: '2024-04-29',
    categories: ['Calming', 'Sleep']
  },
  {
    id: 't-004',
    name: 'Interactive Adventure',
    description: 'Choose-your-own-adventure style template with branching paths',
    usage: 76,
    lastUsed: '2024-04-25',
    categories: ['Interactive', 'Adventure']
  }
];

const Content = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  
  const filteredStories = mockStories.filter(story => 
    story.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    story.category.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  const filteredTemplates = mockTemplates.filter(template => 
    template.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    template.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDelete = (id: string) => {
    toast({
      title: "Content deleted",
      description: `The item with ID ${id} has been deleted successfully.`,
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit content",
      description: `Editing functionality for ${id} will be implemented soon.`,
    });
  };

  const handleView = (id: string) => {
    toast({
      title: "View content",
      description: `Viewing functionality for ${id} will be implemented soon.`,
    });
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: `Bulk ${action}`,
      description: `${action} performed on ${selectedStories.length} items.`,
    });
    setSelectedStories([]);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStories(filteredStories.map(story => story.id));
    } else {
      setSelectedStories([]);
    }
  };

  const toggleSelectStory = (id: string) => {
    if (selectedStories.includes(id)) {
      setSelectedStories(selectedStories.filter(storyId => storyId !== id));
    } else {
      setSelectedStories([...selectedStories, id]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>;
      case 'draft':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Draft</Badge>;
      case 'review':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground">
            Manage stories and templates for your application
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="flex items-center space-x-2 flex-grow">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search stories..." 
                className="flex-grow"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={selectedStories.length === 0}>
                  <Button variant="outline" size="sm" disabled={selectedStories.length === 0}>
                    Bulk Actions ({selectedStories.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkAction("publish")}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>Publish</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("archive")}>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("export")} className="text-blue-600">
                    <Download className="mr-2 h-4 w-4" />
                    <span>Export</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("delete")} className="text-red-600">
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
                      checked={selectedStories.length === filteredStories.length && filteredStories.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="hidden md:table-cell">Metrics</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStories.length > 0 ? (
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
                        <div className="text-sm text-muted-foreground md:hidden">{story.category}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{story.category}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(story.status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {story.createdAt}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          {story.status === 'published' ? (
                            <>
                              <span className="mr-2">{story.readCount.toLocaleString()} reads</span>
                              <span>⭐ {story.rating}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground italic">No metrics yet</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleView(story.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(story.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
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
                                  onClick={() => handleDelete(story.id)}
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
                        Try adjusting your search or create a new story.
                      </p>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Story
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

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
                        <DropdownMenuItem 
                          onClick={() => handleDelete(template.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.categories.map(category => (
                      <Badge key={category} variant="outline">{category}</Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <div>Used {template.usage} times</div>
                    <div>Last used: {template.lastUsed}</div>
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
