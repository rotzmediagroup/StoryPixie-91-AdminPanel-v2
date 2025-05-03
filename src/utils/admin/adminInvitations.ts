
import { collection, doc, getDoc, getDocs, query, where, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { UserRole, AdminInvitation } from '@/types';
import { toast } from '@/hooks/use-toast';
import { logAdminActivity } from './adminLogsHelpers';
import { v4 as uuidv4 } from 'uuid';

// Create invitation for a new admin user
export const createAdminInvitation = async (
  email: string,
  role: UserRole,
  currentAdminId: string,
  currentAdminEmail: string
): Promise<boolean> => {
  try {
    // Check if invitation already exists
    const existingInvitations = await getDocs(
      query(collection(db, 'adminInvitations'), where('email', '==', email), where('status', '==', 'pending'))
    );
    
    if (!existingInvitations.empty) {
      toast({
        title: "Invitation exists",
        description: "An invitation has already been sent to this email.",
        variant: "default"
      });
      return false;
    }
    
    // Create token and expiration date (48 hours from now)
    const token = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    
    const invitation: AdminInvitation = {
      id: uuidv4(),
      email,
      role,
      status: 'pending',
      createdAt: now.toISOString(),
      expiresAt,
      createdBy: currentAdminId,
      token
    };
    
    await addDoc(collection(db, 'adminInvitations'), {
      ...invitation,
      createdAt: serverTimestamp()
    });
    
    await logAdminActivity(
      currentAdminId,
      currentAdminEmail,
      'sent_admin_invitation',
      { invitedEmail: email, assignedRole: role }
    );
    
    toast({
      title: "Invitation sent",
      description: "Admin invitation has been created.",
      variant: "default"
    });
    
    return true;
  } catch (error) {
    console.error('Error creating admin invitation:', error);
    toast({
      title: "Error",
      description: "Failed to create admin invitation.",
      variant: "destructive"
    });
    return false;
  }
};

// Verify admin invitation and create account
export const verifyAndAcceptInvitation = async (token: string, password: string, name: string): Promise<boolean> => {
  try {
    // Find invitation by token
    const invitationsQuery = await getDocs(
      query(collection(db, 'adminInvitations'), where('token', '==', token), where('status', '==', 'pending'))
    );
    
    if (invitationsQuery.empty) {
      toast({
        title: "Invalid invitation",
        description: "This invitation is invalid or has expired.",
        variant: "destructive"
      });
      return false;
    }
    
    const invitationDoc = invitationsQuery.docs[0];
    const invitation = invitationDoc.data() as AdminInvitation;
    
    // Check if invitation has expired
    if (new Date(invitation.expiresAt) < new Date()) {
      await updateDoc(doc(db, 'adminInvitations', invitationDoc.id), {
        status: 'expired'
      });
      
      toast({
        title: "Invitation expired",
        description: "This invitation has expired.",
        variant: "destructive"
      });
      return false;
    }
    
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, invitation.email, password);
    const user = userCredential.user;
    
    // Create admin user document
    await updateDoc(doc(db, 'adminUsers', user.uid), {
      email: invitation.email,
      name,
      role: invitation.role,
      createdAt: serverTimestamp(),
      createdBy: invitation.createdBy,
      invitationId: invitation.id
    });
    
    // Update invitation status
    await updateDoc(doc(db, 'adminInvitations', invitationDoc.id), {
      status: 'accepted',
      acceptedAt: serverTimestamp()
    });
    
    toast({
      title: "Account created",
      description: "Your admin account has been created successfully.",
      variant: "default"
    });
    
    return true;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    toast({
      title: "Error",
      description: (error as Error).message || "Failed to create account.",
      variant: "destructive"
    });
    return false;
  }
};
