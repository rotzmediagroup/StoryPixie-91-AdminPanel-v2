import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { CircleUser, User, Save } from 'lucide-react';
import { updateUserProfile } from '@/utils/userProfileHelpers';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User as UserType } from '@/types';

interface AccountSectionProps {
  currentUser: UserType;
}

const AccountSection = ({ currentUser }: AccountSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    profileImage: currentUser?.profileImage || '',
  });

  const handleAccountFormChange = (e) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccountSave = async () => {
    if (!currentUser || !currentUser.id) {
      toast({
        title: "Error",
        description: "No user logged in",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Only update if values have changed
      if (accountForm.name !== currentUser.name || accountForm.profileImage !== currentUser.profileImage) {
        const success = await updateUserProfile(currentUser.id, {
          name: accountForm.name,
          profileImage: accountForm.profileImage,
        });
        
        if (success) {
          toast({
            title: "Account updated",
            description: "Your account information has been updated successfully.",
          });
          
          toast({
            title: "Refresh needed",
            description: "Please refresh the page to see your updated information.",
            variant: "default",
          });
        } else {
          toast({
            title: "Update failed",
            description: "There was an error updating your account information.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "No changes detected",
          description: "No changes were made to your account information.",
        });
      }
    } catch (error) {
      console.error("Error saving account information:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your account information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "We've sent an email with confirmation instructions.",
      variant: "default",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CircleUser className="h-5 w-5" />
            <CardTitle>Account Information</CardTitle>
          </div>
          <CardDescription>
            Update your account details and profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-24 w-24 rounded-full overflow-hidden border">
                {accountForm.profileImage ? (
                  <img 
                    src={accountForm.profileImage} 
                    alt="Profile" 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-100">
                    <User className="h-12 w-12 text-slate-400" />
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={accountForm.name}
                  onChange={handleAccountFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={accountForm.email}
                  onChange={handleAccountFormChange}
                  readOnly
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed directly. Please contact support.
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={handleAccountSave} 
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-rose-600">Danger Zone</CardTitle>
          <CardDescription>
            Permanent actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-rose-200 rounded-md bg-rose-50">
            <div>
              <h4 className="font-medium text-rose-600">Delete Account</h4>
              <p className="text-sm text-rose-600/80">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="mt-4 sm:mt-0">
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Label htmlFor="confirmDelete">Type "DELETE" to confirm</Label>
                  <Input id="confirmDelete" placeholder="DELETE" />
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountSection;
