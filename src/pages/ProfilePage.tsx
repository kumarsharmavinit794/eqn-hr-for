import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Mail, Phone, Save, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

const getInitialName = () => {
  const storedName = localStorage.getItem("name")?.trim();
  const storedEmail = localStorage.getItem("email")?.trim();

  if (storedName) {
    return storedName;
  }

  if (!storedEmail) {
    return "User";
  }

  return storedEmail
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => ({
    name: getInitialName(),
    email: localStorage.getItem("email") || "user@nexahr.com",
    phone: localStorage.getItem("phone") || "+91 98765 43210",
    bio:
      localStorage.getItem("bio") ||
      "HR operations lead focused on building a smooth employee experience across hiring, onboarding, and growth.",
  }));
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    api.get("/profile").then((response) => {
      const user = response.data?.data?.user || response.data?.user;
      if (!user) return;
      setProfile((prev) => ({
        ...prev,
        name: user.name || user.fullName || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }).catch(() => undefined);
  }, []);

  const initials = useMemo(
    () =>
      profile.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "U",
    [profile.name],
  );

  const handleChange = (field: "name" | "phone" | "bio", value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSavedMessage("");
  };

  const handleSave = () => {
    localStorage.setItem("name", profile.name);
    localStorage.setItem("email", profile.email);
    localStorage.setItem("phone", profile.phone);
    localStorage.setItem("bio", profile.bio);
    setSavedMessage("Profile updated successfully.");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="page-header">Profile</h1>
        <p className="page-subheader">Manage your public details and personal information from one place.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Card className="glass-card overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-teal-500/30 via-emerald-500/20 to-cyan-500/30" />
          <CardContent className="-mt-10 space-y-5 p-6">
            <div className="flex items-end justify-between gap-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="h-4 w-4" />
                Change
              </Button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About</p>
              <p className="mt-2 text-sm leading-6 text-foreground/90">{profile.bio}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Edit Details</CardTitle>
            <CardDescription>These details are shown across your dashboard experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="profile-name"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone Number</Label>
                <Input
                  id="profile-phone"
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email Address</Label>
              <Input id="profile-email" value={profile.email} disabled className="opacity-80" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                value={profile.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="min-h-[140px]"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {savedMessage || "Your latest saved profile details will appear in the top navigation as well."}
              </p>
              <Button onClick={handleSave} className="gap-2 self-start sm:self-auto">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
