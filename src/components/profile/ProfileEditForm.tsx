import { useState } from 'react';
import { useUpdateProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/types/api';

interface ProfileEditFormProps {
  user: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Form for editing the current user's profile.
 * fullName and phoneNumber are editable; email and userType are read-only.
 */
export function ProfileEditForm({ user, onSuccess, onCancel }: ProfileEditFormProps) {
  const { mutate: updateProfile, isPending, isSuccess } = useUpdateProfile();
  const [form, setForm] = useState({
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSuccess && (
        <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
          Profile updated successfully!
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
      </div>

      <div className="space-y-1">
        <Label>Email</Label>
        <Input value={user.email} disabled className="bg-gray-50 text-gray-500" />
        <p className="text-xs text-gray-400">Email cannot be changed.</p>
      </div>

      <div className="space-y-1">
        <Label>Account Type</Label>
        <Input
          value={user.userType === 'customer' ? 'Customer' : 'Provider'}
          disabled
          className="bg-gray-50 text-gray-500"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
