import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AIModel } from "@/types";
import { addAIModel, updateAIModel } from "@/lib/firestoreUtils";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

// Define the form schema using Zod
const modelFormSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  provider: z.string().min(1, "Provider is required"),
  version: z.string().min(1, "Version is required"),
  active: z.boolean().default(true),
  costPerToken: z.preprocess(
    (val) => (val === "" || val === undefined || val === null) ? undefined : Number(val),
    z.number().positive("Cost must be a positive number").optional()
  ),
  maxTokens: z.preprocess(
    (val) => (val === "" || val === undefined || val === null) ? undefined : Number(val),
    z.number().int().positive("Max tokens must be a positive integer").optional()
  ),
  // Add API Key field - consider security implications
  apiKey: z.string().optional(), // Optional for now, might need better handling
});

type ModelFormValues = z.infer<typeof modelFormSchema>;

interface AIModelFormDialogProps {
  model?: AIModel | null; // Pass existing model for editing
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void; // Callback after successful save
}

export const AIModelFormDialog: React.FC<AIModelFormDialogProps> = ({ model, open, onOpenChange, onSuccess }) => {
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!model;

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: '',
      provider: '',
      version: '',
      active: true,
      costPerToken: undefined,
      maxTokens: undefined,
      apiKey: '',
      ...(model || {}), // Spread existing model values if editing
    },
  });

  // Reset form when model changes (e.g., opening dialog for different model)
  useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        provider: '',
        version: '',
        active: true,
        costPerToken: undefined,
        maxTokens: undefined,
        apiKey: '',
        ...(model || {}),
      });
    }
  }, [model, open, form]);

  const onSubmit = async (data: ModelFormValues) => {
    setIsSaving(true);
    console.log("Submitting model data:", data);
    let success = false;
    try {
      if (isEditing && model?.id) {
        // Update existing model - include apiKey if provided
        success = await updateAIModel(model.id, data); // Pass the whole data object
        if (success) {
          toast({ title: "Model Updated", description: `Model '${data.name}' has been updated.` });
        }
      } else {
        // Add new model - include apiKey if provided
        const newModelId = await addAIModel(data); // Pass the whole data object
        success = !!newModelId;
        if (success) {
          toast({ title: "Model Added", description: `Model '${data.name}' has been added.` });
        }
      }

      if (success) {
        onSuccess(); // Trigger refresh or update in parent
        onOpenChange(false); // Close dialog
      }
    } catch (error) {
      console.error("Error saving AI model:", error);
      toast({ title: "Error", description: `Failed to ${isEditing ? 'update' : 'add'} model.`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit AI Model' : 'Add New AI Model'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of the AI model.' : 'Enter the details for the new AI model.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GPT-4 Turbo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., OpenAI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., gpt-4-1106-preview" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key (Optional)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter API Key (stored securely)" {...field} />
                  </FormControl>
                  <FormMessage />
                  {/* TODO: Add note about secure storage/handling */}
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tokens (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 4096" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costPerToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost/Token (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.000001" placeholder="e.g., 0.00001" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="outline" disabled={isSaving}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Model')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

