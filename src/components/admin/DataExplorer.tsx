import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Database, RefreshCw, Download } from 'lucide-react';

const DataExplorer = () => {
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [documents, setDocuments] = useState<Record<string, unknown>[]>([]);
  const [documentContent, setDocumentContent] = useState<Record<string, unknown> | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get list of collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        // Note: Firebase doesn't have a direct API to list collections
        // This is a common workaround, but in production you might want to use a specific
        // admin document that lists the collections in your database
        const knownCollections = [
          'users', 'adminUsers', 'stories', 'systemHealth', 'metrics', 
          'analytics', 'sessions', 'profiles', 'adminActivityLogs'
        ];
        setCollections(knownCollections);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("Failed to load collections");
      }
    };
    
    fetchCollections();
  }, []);
  
  // Fetch documents from selected collection
  const fetchDocuments = async () => {
    if (!selectedCollection) return;
    
    setLoading(true);
    setError(null);
    setDocuments([]);
    setDocumentContent(null);
    
    try {
      const querySnapshot = await getDocs(
        query(collection(db, selectedCollection), limit(50))
      );
      
      const docs: Record<string, unknown>[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setDocuments(docs);
      if (docs.length > 0) {
        setSelectedDocId(docs[0].id);
        setDocumentContent(docs[0]);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(`Failed to load documents from ${selectedCollection}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch single document
  const fetchDocument = async (docId: string) => {
    if (!selectedCollection || !docId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, selectedCollection, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setDocumentContent({
          id: docSnap.id,
          ...docSnap.data()
        });
      } else {
        setError("Document not found");
      }
    } catch (err) {
      console.error("Error fetching document:", err);
      setError(`Failed to load document ${docId}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value);
    setSelectedDocId('');
    setDocumentContent(null);
    setDocuments([]);
  };
  
  const handleDocumentSelect = (docId: string) => {
    setSelectedDocId(docId);
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setDocumentContent(doc);
    } else {
      fetchDocument(docId);
    }
  };
  
  const downloadAsJson = () => {
    const dataStr = JSON.stringify(documentContent, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${selectedCollection}-${selectedDocId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  useEffect(() => {
    if (selectedCollection) {
      fetchDocuments();
    }
  }, [selectedCollection]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Explorer</CardTitle>
        <CardDescription>
          Explore Firebase collections and documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-grow">
              <Select
                value={selectedCollection}
                onValueChange={handleCollectionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection} value={collection}>
                      {collection}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchDocuments}
              disabled={!selectedCollection || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {loading && !documents.length && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-2 rounded-md">
              {error}
            </div>
          )}
          
          {selectedCollection && documents.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border rounded-md p-2 h-96 overflow-y-auto">
                <h3 className="text-sm font-semibold mb-2">Documents</h3>
                <div className="space-y-1">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className={`p-2 cursor-pointer rounded-md ${selectedDocId === doc.id ? 'bg-primary/10 font-medium' : 'hover:bg-accent'}`}
                      onClick={() => handleDocumentSelect(doc.id)}
                    >
                      {doc.id}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md p-2 h-96">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold">Document Content</h3>
                  {documentContent && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={downloadAsJson}
                    >
                      <Download className="h-3 w-3" />
                      <span className="text-xs">JSON</span>
                    </Button>
                  )}
                </div>
                <div className="overflow-y-auto h-[calc(100%-2rem)]">
                  {documentContent && (
                    <pre className="text-xs overflow-x-auto p-1">
                      {JSON.stringify(documentContent, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExplorer;
