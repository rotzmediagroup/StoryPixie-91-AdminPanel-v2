
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

interface CollectionSelectorProps {
  collections: string[];
  currentCollection: string;
  onSelectCollection: (collection: string) => void;
}

const CollectionSelector: React.FC<CollectionSelectorProps> = ({ 
  collections, 
  currentCollection, 
  onSelectCollection 
}) => {
  return (
    <Card className="w-full md:w-64">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-4 w-4" /> Collections
        </CardTitle>
        <CardDescription>Available Firestore collections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {collections.map((collection) => (
            <Button 
              key={collection} 
              variant={currentCollection === collection ? "default" : "outline"} 
              className="w-full justify-start"
              onClick={() => onSelectCollection(collection)}
            >
              {collection}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionSelector;
