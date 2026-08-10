import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth-client';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { LocationUpdater } from '@/components/profile/LocationUpdater';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { StarIcon, Logout01Icon, Edit02Icon } from 'hugeicons-react';

/**
 * User profile page with view/edit mode toggle and logout.
 */
export function Profile() {
  const navigate = useNavigate();
  const { data: session, isPending } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const user = session?.user;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
          Failed to load profile.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile header */}
        <div className="bg-white dark:bg-card rounded-xl border dark:border-border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">
                    {user.userType === 'customer' ? 'Customer' : 'Provider'}
                  </Badge>
                  {(user.rating ?? 0) > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <StarIcon className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      {(user.rating ?? 0).toFixed(1)} ({user.totalRatings ?? 0})
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              <Edit02Icon className="h-3.5 w-3.5 mr-1" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {/* Member since */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Edit form */}
        {isEditing && (
          <div className="bg-white dark:bg-card rounded-xl border dark:border-border p-6">
            <h2 className="font-semibold mb-4">Edit Profile</h2>
            <ProfileEditForm
              user={{
                id: user.id,
                email: user.email,
                fullName: user.name,
                phoneNumber: user.phoneNumber || '',
                userType: user.userType as 'customer' | 'provider',
                isOnline: user.isOnline ?? false,
                rating: user.rating ?? 0,
                totalRatings: user.totalRatings ?? 0,
                createdAt: user.createdAt.toString(),
                updatedAt: user.updatedAt.toString(),
              }}
              onSuccess={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}

        {/* Location updater */}
        <div className="bg-white dark:bg-card rounded-xl border dark:border-border p-6">
          <h2 className="font-semibold mb-4">Location</h2>
          <LocationUpdater />
        </div>

        {/* Logout */}
        <div className="bg-white dark:bg-card rounded-xl border dark:border-border p-6">
          <h2 className="font-semibold mb-4">Account</h2>
          <Button
            variant="outline"
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-800"
            onClick={handleLogout}
          >
            <Logout01Icon className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
}
