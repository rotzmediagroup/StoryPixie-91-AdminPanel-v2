
import React from 'react';
import DataExplorer from '@/components/admin/DataExplorer';

const DatabaseExplorer = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Database Explorer</h2>
        <p className="text-muted-foreground">Explore and visualize Firebase database collections</p>
      </div>
      
      <DataExplorer />
    </div>
  );
};

export default DatabaseExplorer;
