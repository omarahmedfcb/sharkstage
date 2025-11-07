"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { Camera, Trash2, FileDown, CheckCircle2, AlertCircle } from "lucide-react";
import { setUser } from "@/lib/features/auth/authSlice";
import {
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
  uploadAvatar as uploadAvatarRequest,
  removeAvatar as removeAvatarRequest,
} from "@/lib/api/profile";

const fallbackProfile = {
  firstName: "Sarah",
  lastName: "Mitchell",
  email: "sarah.mitchell@sharkstage.com",
  company: "SharkStage Capital",
  phone: "+1 (555) 123-4567",
  bio: "Strategic investor focusing on climate tech, mobility, and AI-first ventures.",
};

function StatusBanner({ status }) {
  if (!status) return null;
  const isSuccess = status.type === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;
  const base = isSuccess
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-600";
  return (
    <div className={`mt-4 flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm ${base}`}>
      <Icon size={16} />
      <span>{status.message}</span>
    </div>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const avatarInputRef = useRef(null);

  const profile = useMemo(() => {
    return {
      firstName: currentUser?.firstName ?? fallbackProfile.firstName,
      lastName: currentUser?.lastName ?? fallbackProfile.lastName,
      email: currentUser?.email ?? fallbackProfile.email,
      company: currentUser?.company ?? fallbackProfile.company,
      phone: currentUser?.phone ?? fallbackProfile.phone,
      bio: currentUser?.bio ?? fallbackProfile.bio,
      accountType: currentUser?.accountType ?? "investor",
      profilePicUrl: currentUser?.profilePicUrl ?? null,
    };
  }, [currentUser]);

  const [profileForm, setProfileForm] = useState(profile);
  const [profileStatus, setProfileStatus] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState(null);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim();

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileStatus(null);
    try {
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        company: profileForm.company,
        phone: profileForm.phone,
        bio: profileForm.bio,
      };
      const updatedUser = await updateProfileRequest(payload);
      dispatch(setUser({ ...currentUser, ...updatedUser }));
      setProfileStatus({ type: "success", message: "Profile details updated successfully." });
    } catch (error) {
      setProfileStatus({
        type: "error",
        message: error.message || "Unable to update profile. Please try again.",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordStatus(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", message: "New password and confirmation do not match." });
      return;
    }
    setPasswordLoading(true);
    try {
      await changePasswordRequest({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordStatus({ type: "success", message: "Password updated successfully." });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordStatus({
        type: "error",
        message: error.message || "Unable to update password. Please try again.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    setAvatarStatus(null);
    try {
      const imageUrl = await uploadAvatarRequest(file);
      dispatch(setUser({ ...currentUser, profilePicUrl: imageUrl }));
      setAvatarStatus({ type: "success", message: "Profile picture updated." });
    } catch (error) {
      setAvatarStatus({
        type: "error",
        message: error.message || "Failed to upload profile picture.",
      });
    } finally {
      setAvatarLoading(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  const handleAvatarRemove = async () => {
    setAvatarLoading(true);
    setAvatarStatus(null);
    try {
      await removeAvatarRequest();
      dispatch(setUser({ ...currentUser, profilePicUrl: null }));
      setAvatarStatus({ type: "success", message: "Profile picture removed." });
    } catch (error) {
      setAvatarStatus({
        type: "error",
        message: error.message || "Failed to remove profile picture.",
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleExportProfile = () => {
    const data = {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      company: profileForm.company,
      phone: profileForm.phone,
      bio: profileForm.bio,
      accountType: profile.accountType,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sharkstage-profile.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="rounded-3xl border border-primary/10 bg-white/90 px-6 py-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-heading md:text-3xl">Account profile</h1>
        <p className="mt-1 text-sm text-paragraph">
          Keep your SharkStage profile up to date to build trust with potential investors and partners.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[280px,1fr]">
        <div className="flex flex-col items-center rounded-3xl border border-primary/10 bg-white/90 p-6 text-center shadow-sm">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-3xl border border-primary/20 bg-primary/10">
              {profile.profilePicUrl ? (
                <Image
                  src={profile.profilePicUrl}
                  alt={fullName}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-3xl font-semibold text-primary">
                  {profileForm.firstName?.[0]}
                  {profileForm.lastName?.[0]}
                </div>
              )}
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarLoading}
              className="absolute -bottom-3 right-0 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
            >
              <Camera size={14} /> {avatarLoading ? "Uploading..." : "Upload"}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
            />
          </div>
          <p className="mt-4 text-sm font-semibold text-heading">{fullName}</p>
          <p className="text-xs capitalize text-primary">{profile.accountType}</p>
          <button
            onClick={handleAvatarRemove}
            disabled={avatarLoading || !profile.profilePicUrl}
            className="mt-4 inline-flex items-center gap-1 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:border-red-300 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300"
          >
            <Trash2 size={14} /> Remove photo
          </button>
          <div className="mt-6 w-full rounded-2xl border border-primary/10 bg-primary/5 p-4 text-left text-xs text-paragraph">
            <p className="font-semibold text-heading">Tip</p>
            <p className="mt-1">
              Use a professional headshot to build trust. Investors with complete profiles receive 2.3x
              more engagement.
            </p>
          </div>
          <StatusBanner status={avatarStatus} />
        </div>

        <div className="rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm">
          <form className="grid gap-5" onSubmit={handleProfileSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                  First name
                </label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                  Last name
                </label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                Email address
              </label>
              <input
                type="email"
                value={profileForm.email}
                disabled
                className="w-full rounded-2xl border border-primary/20 bg-gray-100 px-4 py-2 text-sm text-paragraph shadow-sm"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                  Company / Fund name
                </label>
                <input
                  type="text"
                  value={profileForm.company}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, company: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                Bio
              </label>
              <textarea
                value={profileForm.bio}
                rows={4}
                onChange={(event) =>
                  setProfileForm((prev) => ({ ...prev, bio: event.target.value }))
                }
                className="w-full resize-none rounded-2xl border border-primary/20 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportProfile}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40"
              >
                <FileDown size={16} /> Export profile
              </button>
              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
              >
                {profileLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
          <StatusBanner status={profileStatus} />
        </div>
      </section>

      <section className="rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-heading">Security</h2>
        <p className="text-sm text-paragraph">
          Update your password regularly to keep your portfolio secure.
        </p>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handlePasswordSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
              Current password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
              }
              required
              className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
              New password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
              }
              required
              className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
              Confirm password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
              }
              required
              className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-end justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
            >
              {passwordLoading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
        <StatusBanner status={passwordStatus} />
      </section>
    </div>
  );
}
