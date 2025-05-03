
import { UserRole } from '@/types';

// Role-based permission check - improved to handle undefined roles better
export const hasPermission = (currentUserRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  if (!currentUserRole) return false;

  // Updated role hierarchy with fallback handling
  const roleHierarchy: Record<string, number> = {
    'super_admin': 6,
    'admin': 5,
    'content_moderator': 4,
    'support_staff': 3,
    'analytics_viewer': 2,
    'observer': 1
  };

  // Handle legacy roles or custom roles
  const getLevelForRole = (role: string): number => {
    // Direct match in hierarchy
    if (roleHierarchy[role] !== undefined) {
      return roleHierarchy[role];
    }
    
    // Handle legacy/alternative admin roles
    if (role === 'administrator' || role === 'owner') {
      return roleHierarchy['admin'];
    }
    
    // Default to lowest level if unknown role
    return 0;
  };

  const userRoleLevel = getLevelForRole(currentUserRole);
  const requiredRoleLevel = getLevelForRole(requiredRole);

  return userRoleLevel >= requiredRoleLevel;
};

// Check for specific admin management permissions - expanded to include more admin roles
export const hasAdminManagementPermission = (role: UserRole | undefined): boolean => {
  if (!role) return false;
  
  return role === 'super_admin' || role === 'admin' || role === 'administrator' || role === 'owner';
};
