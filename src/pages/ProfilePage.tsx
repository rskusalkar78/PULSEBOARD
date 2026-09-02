import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User as UserIcon,
  Mail,
  Shield,
  Clock,
  LogOut,
  Save,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  Monitor,
  Bell,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import {
  profileSchema,
  SUPPORTED_TIMEZONES,
  type ProfileFormData,
} from '@/features/auth/schemas/profileSchemas';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import {
  Input,
  Select,
  Textarea,
  Switch,
  Button,
  Alert,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const {
    profileData,
    isSaving,
    isUploadingAvatar,
    error: profileError,
    successMessage,
    setError,
    setSuccessMessage,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<'general' | 'preferences'>('general');

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  });

  // Sync form with profile data when loaded/updated
  useEffect(() => {
    reset(profileData);
  }, [profileData, reset]);

  const currentTheme = watch('preferences.theme');
  const watchedAvatarUrl = watch('avatarUrl');
  const watchedFullName = watch('fullName');

  const onSubmit = async (data: ProfileFormData) => {
    const success = await updateProfile(data);
    if (success) {
      reset(data);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const uploadedUrl = await uploadAvatar(file);
    if (uploadedUrl) {
      setValue('avatarUrl', uploadedUrl, { shouldDirty: true });
    }
  };

  const handleAvatarRemove = () => {
    removeAvatar();
    setValue('avatarUrl', '', { shouldDirty: true });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <UserIcon className="w-6 h-6 text-indigo-400" />
            User Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your public profile, executive role details, timezone, and workspace preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out Session
        </button>
      </div>

      {/* Global Alerts */}
      {profileError && (
        <Alert
          variant="danger"
          title="Profile Update Error"
          dismissible
          onDismiss={() => setError(null)}
        >
          {profileError}
        </Alert>
      )}

      {successMessage && (
        <Alert
          variant="success"
          title="Success"
          dismissible
          onDismiss={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {/* Profile Overview Card Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          <div className="relative">
            <AvatarUpload
              avatarUrl={watchedAvatarUrl}
              name={watchedFullName || user?.name || 'User'}
              isUploading={isUploadingAvatar}
              onUpload={handleAvatarUpload}
              onRemove={handleAvatarRemove}
            />
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-100">{profileData.fullName}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Shield className="w-3 h-3 mr-1" />
                {profileData.role}
              </span>
            </div>

            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              {profileData.email}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Timezone: <strong className="text-slate-200">{profileData.timezone}</strong>
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form with Tabs */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" novalidate>
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'general' | 'preferences')}
          className="w-full space-y-6"
        >
          <TabsList className="grid grid-cols-2 max-w-md bg-slate-900 border border-slate-800 rounded-xl p-1">
            <TabsTrigger value="general" className="gap-2 text-xs font-semibold">
              <UserIcon className="w-3.5 h-3.5" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2 text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5" />
              Preferences & Theme
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Profile Information */}
          <TabsContent value="general" className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-indigo-400" />
                  Personal Information
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your display name, email, role, and timezone.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name / Display Name */}
                <div className="space-y-1.5">
                  <Input
                    label="Display Name"
                    id="profile-display-name"
                    placeholder="Alex Morgan"
                    required
                    error={errors.fullName?.message}
                    {...register('fullName')}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Input
                    label="Email Address"
                    id="profile-email"
                    type="email"
                    placeholder="alex.morgan@pulseboard.io"
                    required
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <Input
                    label="Role / Title"
                    id="profile-role"
                    placeholder="Executive Lead"
                    required
                    error={errors.role?.message}
                    {...register('role')}
                  />
                </div>

                {/* Timezone */}
                <div className="space-y-1.5">
                  <Controller
                    name="timezone"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Timezone"
                        id="profile-timezone"
                        required
                        error={errors.timezone?.message}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        options={SUPPORTED_TIMEZONES.map((tz) => ({
                          label: tz,
                          value: tz,
                        }))}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Textarea
                  label="Executive Bio"
                  id="profile-bio"
                  placeholder="Brief summary of your organizational responsibilities and domain focus..."
                  rows={3}
                  error={errors.bio?.message}
                  {...register('bio')}
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Preferences & Theme */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Theme Preference
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your preferred color theme. Changes take effect instantly.
                </p>
              </div>

              {/* Theme Mode Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'light',
                    title: 'Light Theme',
                    desc: 'Clean high contrast',
                    icon: Sun,
                    color: 'text-amber-400',
                  },
                  {
                    id: 'dark',
                    title: 'Dark Slate',
                    desc: 'Executive dark mode',
                    icon: Moon,
                    color: 'text-indigo-400',
                  },
                  {
                    id: 'system',
                    title: 'System Default',
                    desc: 'Match OS setting',
                    icon: Monitor,
                    color: 'text-cyan-400',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = currentTheme === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setValue('preferences.theme', item.id as 'light' | 'dark' | 'system', {
                          shouldDirty: true,
                        })
                      }
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition-all duration-200 ${
                        isSelected
                          ? 'bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-100">{item.title}</div>
                        <div className="text-xs text-slate-400">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Notification Toggles */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Notification Channels</h3>
                </div>

                <div className="space-y-3 divide-y divide-slate-800/60">
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-sm font-medium text-slate-300">Email Notifications</p>
                      <p className="text-xs text-slate-500">
                        Receive activity digests and security updates via email
                      </p>
                    </div>
                    <Controller
                      name="preferences.notifications.email"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Email Notifications"
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div>
                      <p className="text-sm font-medium text-slate-300">Push Notifications</p>
                      <p className="text-xs text-slate-500">
                        Receive desktop alerts for urgent mentions and assignments
                      </p>
                    </div>
                    <Controller
                      name="preferences.notifications.push"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Push Notifications"
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div>
                      <p className="text-sm font-medium text-slate-300">In-App Alerts</p>
                      <p className="text-xs text-slate-500">
                        Display notification bell badges and popups inside the app
                      </p>
                    </div>
                    <Controller
                      name="preferences.notifications.inApp"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="In-App Alerts"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving || !isDirty}
            onClick={() => reset(profileData)}
          >
            Cancel Changes
          </Button>

          <Button type="submit" variant="primary" disabled={isSaving} className="gap-2 px-6">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
