import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Key, Shield, Users, Mail, Lock, Settings, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

type AccessStatus = "active" | "deactivated";

interface AccessUser {
  user_id: number;
  employee: string;
  email: string;
  accesses: Array<{
    id: number;
    system_id: number;
    system: string;
    role: string;
    status: AccessStatus;
  }>;
}

interface RoleItem {
  id: number;
  role_name: string;
  users: number;
  permissions: string[];
}

interface PermissionItem {
  id: number;
  permission_name: string;
}

interface SecuritySetting {
  id: number;
  setting_name: string;
  description: string;
  enabled: boolean;
}

interface SystemItem {
  id: number;
  name: string;
}

interface UserDirectoryItem {
  id: number;
  fullName: string;
  email: string;
}

export default function ITAccessPage() {
  const [users, setUsers] = useState<AccessUser[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [security, setSecurity] = useState<SecuritySetting[]>([]);
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [directory, setDirectory] = useState<UserDirectoryItem[]>([]);
  const [summary, setSummary] = useState<{ total_users: number; active_users: number; system_count: number; pending_requests: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [grantOpen, setGrantOpen] = useState(false);
  const [grantUserId, setGrantUserId] = useState<string>("");
  const [grantSystemId, setGrantSystemId] = useState<string>("");
  const [grantRole, setGrantRole] = useState<string>("");
  const [grantStatus, setGrantStatus] = useState<AccessStatus>("active");

  const [createSystemOpen, setCreateSystemOpen] = useState(false);
  const [newSystemName, setNewSystemName] = useState("");

  const [activeAccessId, setActiveAccessId] = useState<number | null>(null);
  const [updateRole, setUpdateRole] = useState("");
  const [updateStatus, setUpdateStatus] = useState<AccessStatus>("active");
  const [updateOpen, setUpdateOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, r, p, s, summaryRes, sysRes, dirRes] = await Promise.all([
        api.get("/access/users"),
        api.get("/roles"),
        api.get("/permissions"),
        api.get("/security/settings"),
        api.get("/access/summary"),
        api.get("/access/systems"),
        api.get("/access/user-directory"),
      ]);
      setUsers(u.data?.data || []);
      setRoles(r.data?.data || []);
      setPermissions(p.data?.data || []);
      setSecurity(s.data?.data || []);
      setSummary(summaryRes.data?.data || null);
      setSystems(sysRes.data?.data || []);
      setDirectory(dirRes.data?.data || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
      setRoles([]);
      setPermissions([]);
      setSecurity([]);
      setSummary(null);
      setSystems([]);
      setDirectory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const activeUsers = summary?.active_users ?? 0;
  const systemCount = summary?.system_count ?? 0;
  const pendingRequests = summary?.pending_requests ?? 0;
  const securityScore = useMemo(() => {
    if (!security.length) return 0;
    const enabledCount = security.filter((item) => item.enabled).length;
    return Math.round((enabledCount / security.length) * 100);
  }, [security]);

  const openUpdateDialog = (accessId: number, role: string, status: AccessStatus) => {
    setActiveAccessId(accessId);
    setUpdateRole(role || "");
    setUpdateStatus(status);
    setUpdateOpen(true);
  };

  const submitAccessUpdate = async () => {
    if (!activeAccessId) return;
    setActionLoading(true);
    try {
      await api.patch(`/access/update/${activeAccessId}`, { role: updateRole, status: updateStatus });
      setUpdateOpen(false);
      setActiveAccessId(null);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const submitGrant = async () => {
    if (!grantUserId || !grantSystemId) return;
    setActionLoading(true);
    try {
      await api.post("/access/grant", {
        user_id: Number(grantUserId),
        system_id: Number(grantSystemId),
        role: grantRole,
        status: grantStatus,
      });
      setGrantOpen(false);
      setGrantUserId("");
      setGrantSystemId("");
      setGrantRole("");
      setGrantStatus("active");
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSecurity = async (setting: SecuritySetting, enabled: boolean) => {
    setActionLoading(true);
    try {
      await api.patch(`/security/settings/${setting.id}`, { enabled });
      setSecurity((prev) => prev.map((item) => (item.id === setting.id ? { ...item, enabled } : item)));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const createSystem = async () => {
    const name = newSystemName.trim();
    if (!name) return;
    setActionLoading(true);
    try {
      await api.post("/access/systems", { name });
      setCreateSystemOpen(false);
      setNewSystemName("");
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">IT & Access Management</h1>
        <p className="page-subheader">System access, role-based permissions & security settings</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Users", value: activeUsers.toString(), icon: Users },
          { label: "System Integrations", value: systemCount.toString(), icon: Monitor },
          { label: "Security Score", value: `${securityScore}%`, icon: Shield },
          { label: "Pending Requests", value: pendingRequests.toString(), icon: Key },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="access">
        <TabsList>
          <TabsTrigger value="access">System Access</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              <div className="flex flex-wrap justify-end gap-2 pb-2">
                <Dialog open={createSystemOpen} onOpenChange={setCreateSystemOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" disabled={actionLoading}>
                      New System
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create System</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>System Name</Label>
                        <Input value={newSystemName} onChange={(e) => setNewSystemName(e.target.value)} placeholder="e.g., GitHub" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setCreateSystemOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => void createSystem()} disabled={actionLoading}>
                          Create
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={grantOpen} onOpenChange={setGrantOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={actionLoading}>
                      Grant Access
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Grant System Access</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>User</Label>
                        <Select value={grantUserId} onValueChange={setGrantUserId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            {directory.map((u) => (
                              <SelectItem key={u.id} value={String(u.id)}>
                                {u.fullName} ({u.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>System</Label>
                        <Select value={grantSystemId} onValueChange={setGrantSystemId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select system" />
                          </SelectTrigger>
                          <SelectContent>
                            {systems.map((sys) => (
                              <SelectItem key={sys.id} value={String(sys.id)}>
                                {sys.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Input value={grantRole} onChange={(e) => setGrantRole(e.target.value)} placeholder="e.g., developer" />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select value={grantStatus} onValueChange={(value: AccessStatus) => setGrantStatus(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">active</SelectItem>
                              <SelectItem value="deactivated">deactivated</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setGrantOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => void submitGrant()} disabled={actionLoading || !grantUserId || !grantSystemId}>
                          Grant
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {users.map((s) => (
                <div key={s.email} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {s.employee.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.employee}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{s.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {(s.accesses || []).map((access) => (
                      <Badge key={access.id} variant="secondary" className="text-xs">
                        {access.system}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const first = s.accesses?.[0];
                      if (first) openUpdateDialog(first.id, first.role, first.status);
                    }}
                    disabled={!s.accesses?.length || actionLoading}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  {s.accesses?.some((a) => a.status === "active") ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              ))}
              {users.length === 0 && <p className="text-sm text-muted-foreground">No system access records found.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-3">
              {roles.map((r) => (
                <div key={r.id} className="p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">{r.role_name}</p>
                      <p className="text-xs text-muted-foreground">{r.users} users</p>
                    </div>
                    <Button size="sm" variant="outline"><Settings className="w-4 h-4 mr-1" /> Edit</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(r.permissions || []).map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>
              ))}
              {roles.length === 0 && <p className="text-sm text-muted-foreground">No roles found.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-3">
              {security.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{s.setting_name}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                  <Switch checked={s.enabled} onCheckedChange={(checked) => void toggleSecurity(s, checked)} disabled={actionLoading} />
                </div>
              ))}
              {security.length === 0 && <p className="text-sm text-muted-foreground">No security settings configured.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={updateRole} onChange={(e) => setUpdateRole(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={updateStatus} onValueChange={(value: AccessStatus) => setUpdateStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">active</SelectItem>
                  <SelectItem value="deactivated">deactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUpdateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => void submitAccessUpdate()} disabled={actionLoading}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
