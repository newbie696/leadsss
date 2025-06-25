import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Pencil, Trash2, Check, X } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Campaign {
  id: string;
  name: string;
  url: string;
}

interface Permission {
  userId: string;
  userName: string;
  campaignId: string;
  campaignName: string;
  hasAccess: boolean;
}

const AdminPanel = () => {
  // Mock data for team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Manager",
      status: "Active",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "User",
      status: "Inactive",
    },
  ]);

  // Mock data for campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: "1", name: "Summer Promotion", url: "https://example.com/summer" },
    { id: "2", name: "Fall Collection", url: "https://example.com/fall" },
    { id: "3", name: "Holiday Special", url: "https://example.com/holiday" },
  ]);

  // Mock data for permissions
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      userId: "1",
      userName: "John Doe",
      campaignId: "1",
      campaignName: "Summer Promotion",
      hasAccess: true,
    },
    {
      userId: "1",
      userName: "John Doe",
      campaignId: "2",
      campaignName: "Fall Collection",
      hasAccess: true,
    },
    {
      userId: "2",
      userName: "Jane Smith",
      campaignId: "1",
      campaignName: "Summer Promotion",
      hasAccess: true,
    },
    {
      userId: "3",
      userName: "Mike Johnson",
      campaignId: "3",
      campaignName: "Holiday Special",
      hasAccess: true,
    },
  ]);

  // State for dialogs
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] =
    useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");

  // Form states
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  });

  // Handlers
  const handleAddMember = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const member = { ...newMember, id } as TeamMember;
    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: "", email: "", role: "User", status: "Active" });
    setIsAddMemberDialogOpen(false);
  };

  const handleEditMember = () => {
    if (selectedMember) {
      setTeamMembers(
        teamMembers.map((member) =>
          member.id === selectedMember.id ? selectedMember : member,
        ),
      );
      setIsEditMemberDialogOpen(false);
    }
  };

  const handleDeleteMember = () => {
    if (selectedMember) {
      setTeamMembers(
        teamMembers.filter((member) => member.id !== selectedMember.id),
      );
      // Also remove permissions for this user
      setPermissions(
        permissions.filter(
          (permission) => permission.userId !== selectedMember.id,
        ),
      );
      setIsDeleteMemberDialogOpen(false);
    }
  };

  const togglePermission = (userId: string, campaignId: string) => {
    setPermissions(
      permissions.map((permission) => {
        if (
          permission.userId === userId &&
          permission.campaignId === campaignId
        ) {
          return { ...permission, hasAccess: !permission.hasAccess };
        }
        return permission;
      }),
    );
  };

  const getUserPermissions = (userId: string) => {
    return permissions.filter((permission) => permission.userId === userId);
  };

  // Check if a user has access to a campaign
  const hasAccess = (userId: string, campaignId: string) => {
    const permission = permissions.find(
      (p) => p.userId === userId && p.campaignId === campaignId,
    );
    return permission ? permission.hasAccess : false;
  };

  // Add permission for a user to a campaign if it doesn't exist
  const ensurePermissionExists = (
    userId: string,
    userName: string,
    campaignId: string,
    campaignName: string,
  ) => {
    const permissionExists = permissions.some(
      (p) => p.userId === userId && p.campaignId === campaignId,
    );

    if (!permissionExists) {
      setPermissions([
        ...permissions,
        { userId, userName, campaignId, campaignName, hasAccess: false },
      ]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <Tabs defaultValue="team" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Team Management Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your team members and their roles.
                  </CardDescription>
                </div>
                <Dialog
                  open={isAddMemberDialogOpen}
                  onOpenChange={setIsAddMemberDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>
                        Create a new team member account with appropriate
                        permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          className="col-span-3"
                          value={newMember.name}
                          onChange={(e) =>
                            setNewMember({ ...newMember, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="col-span-3"
                          value={newMember.email}
                          onChange={(e) =>
                            setNewMember({
                              ...newMember,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                          Role
                        </Label>
                        <Select
                          value={newMember.role}
                          onValueChange={(value) =>
                            setNewMember({ ...newMember, role: value })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="User">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Select
                          value={newMember.status}
                          onValueChange={(value) =>
                            setNewMember({ ...newMember, status: value })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddMemberDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddMember}>Add Member</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${member.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {member.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={
                              isEditMemberDialogOpen &&
                              selectedMember?.id === member.id
                            }
                            onOpenChange={(open) => {
                              setIsEditMemberDialogOpen(open);
                              if (open) setSelectedMember(member);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Team Member</DialogTitle>
                                <DialogDescription>
                                  Update team member details and permissions.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedMember && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="edit-name"
                                      className="text-right"
                                    >
                                      Name
                                    </Label>
                                    <Input
                                      id="edit-name"
                                      className="col-span-3"
                                      value={selectedMember.name}
                                      onChange={(e) =>
                                        setSelectedMember({
                                          ...selectedMember,
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="edit-email"
                                      className="text-right"
                                    >
                                      Email
                                    </Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      className="col-span-3"
                                      value={selectedMember.email}
                                      onChange={(e) =>
                                        setSelectedMember({
                                          ...selectedMember,
                                          email: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="edit-role"
                                      className="text-right"
                                    >
                                      Role
                                    </Label>
                                    <Select
                                      value={selectedMember.role}
                                      onValueChange={(value) =>
                                        setSelectedMember({
                                          ...selectedMember,
                                          role: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Admin">
                                          Admin
                                        </SelectItem>
                                        <SelectItem value="Manager">
                                          Manager
                                        </SelectItem>
                                        <SelectItem value="User">
                                          User
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="edit-status"
                                      className="text-right"
                                    >
                                      Status
                                    </Label>
                                    <Select
                                      value={selectedMember.status}
                                      onValueChange={(value) =>
                                        setSelectedMember({
                                          ...selectedMember,
                                          status: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Active">
                                          Active
                                        </SelectItem>
                                        <SelectItem value="Inactive">
                                          Inactive
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setIsEditMemberDialogOpen(false)
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleEditMember}>
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog
                            open={
                              isDeleteMemberDialogOpen &&
                              selectedMember?.id === member.id
                            }
                            onOpenChange={(open) => {
                              setIsDeleteMemberDialogOpen(open);
                              if (open) setSelectedMember(member);
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Team Member
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {member.name}?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteMember}
                                  className="bg-red-500 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Permissions</CardTitle>
              <CardDescription>
                Manage which team members have access to specific campaigns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="user-select">Select Team Member</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUser && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Campaign Access for{" "}
                    {teamMembers.find((m) => m.id === selectedUser)?.name}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="text-center">Access</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => {
                        // Ensure permission exists for this user-campaign combination
                        const userName =
                          teamMembers.find((m) => m.id === selectedUser)
                            ?.name || "";
                        ensurePermissionExists(
                          selectedUser,
                          userName,
                          campaign.id,
                          campaign.name,
                        );

                        return (
                          <TableRow key={campaign.id}>
                            <TableCell className="font-medium">
                              {campaign.name}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {campaign.url}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                <Button
                                  variant={
                                    hasAccess(selectedUser, campaign.id)
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="w-24"
                                  onClick={() =>
                                    togglePermission(selectedUser, campaign.id)
                                  }
                                >
                                  {hasAccess(selectedUser, campaign.id) ? (
                                    <span className="flex items-center gap-2">
                                      <Check className="h-4 w-4" /> Granted
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-2">
                                      <X className="h-4 w-4" /> Denied
                                    </span>
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">
                Reset
              </Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
