import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useProfile';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { LocationUpdater } from '@/components/profile/LocationUpdater';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { authManager } from '@/lib/api/auth';
import { Star, LogOut, Pencil } from 'lucide-react';

/**
 * User profile page with view/edit mode toggle and logout.
 */
export function Profile() {
  const navigate = useNavigate();
  const { data: result, isLoading } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  const user = result?.data;

  const handleLogout = () => {
    authManager.clearToken();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-64 text-gray-400">
          Failed to load profile.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile header */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{user.fullName}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="text-xs bg-blue-100 text-blue-700">
                    {user.userType === 'customer' ? 'Customer' : 'Provider'}
                  </Badge>
                  {user.rating > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      {user.rating.toFixed(1)} ({user.totalRatings})
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
              <Pencil className="h-3.5 w-3.5 mr-1" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {/* Member since */}
          <p className="text-xs text-gray-400 mt-4">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Edit form */}
        {isEditing && (
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Edit Profile</h2>
            <ProfileEditForm
              user={user}
              onSuccess={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}

        {/* Location updater */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Location</h2>
          <LocationUpdater />
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Account</h2>
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-50 border-red-200"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
}
