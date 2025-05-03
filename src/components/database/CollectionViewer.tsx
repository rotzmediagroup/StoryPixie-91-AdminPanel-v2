import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Search } from 'lucide-react';

interface CollectionViewerProps {
  collectionName: string;
  data: Record<string, unknown>[] | null;
  loading: boolean;
  error: string | null;
  pathExists: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
}

const CollectionViewer: React.FC<CollectionViewerProps> = ({
  collectionName,
  data,
  loading,
  error,
  pathExists,
  searchQuery,
  onSearchChange,
  onRefresh
}) => {
  // Filter data by search query
  const filteredData = searchQuery && data 
    ? data.filter((item: Record<string, unknown>) => 
        JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : data;

  // Get all keys from all objects for table headers
  const getTableHeaders = () => {
    if (!filteredData || filteredData.length === 0) return ['id'];
    
    const allKeys = new Set<string>();
    allKeys.add('id'); // Always include id
    
    filteredData.forEach((item: Record<string, unknown>) => {
      Object.keys(item).forEach(key => {
        if (key !== 'id') allKeys.add(key);
      });
    });
    
    return Array.from(allKeys);
  };

  // Function to render a cell value based on its type
  const renderCellValue = (value: unknown) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">null</span>;
    }
    
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    
    if (typeof value === 'object') {
      if (value.seconds && value.nanoseconds) {
        // This is likely a Firestore timestamp
        const date = new Date(value.seconds * 1000);
        return date.toLocaleString();
      }
      
      if (Array.isArray(value)) {
        return (
          <Badge variant="outline" className="font-mono">
            Array[{value.length}]
          </Badge>
        );
      }
      
      return (
        <Badge variant="outline" className="font-mono">
          Object
        </Badge>
      );
    }
    
    return String(value);
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Collection: {collectionName}</span>
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
          >
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          {pathExists 
            ? `Found ${filteredData?.length || 0} documents` 
            : "No documents found"
          }
        </CardDescription>
        
        <div className="mt-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search in results..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {pathExists && filteredData && filteredData.length > 0 ? (
          <div className="border rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {getTableHeaders().map((header) => (
                    <TableHead key={header}>
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item: Record<string, unknown>, index: number) => (
                  <TableRow key={item.id || index}>
                    {getTableHeaders().map(header => (
                      <TableCell key={`${item.id}-${header}`}>
                        {renderCellValue(item[header])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            {loading ? (
              <p className="text-muted-foreground">Loading data...</p>
            ) : (
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "No results match your search" 
                  : "No documents in this collection"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollectionViewer;
