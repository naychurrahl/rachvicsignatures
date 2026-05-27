import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, UserCog } from "lucide-react";
import { Staff } from "@/app/data/interFaces";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { toast } from "sonner";
import { useApp } from "@/app/contexts/AppContext";

export function OwnerStaff() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState<Staff>({
    id: "",
    name: "",
    email: "",
    role: "staff",
    active: "active",
  });

  const { staff, loadStaff, setloadStaff } = useApp();
  
  console.log({ staffs: staff, load: loadStaff });
  if(!staff) setloadStaff(!loadStaff);

  const addStaff = async (staff: Staff) => {
    const add = await ApiRequest({
      url: `${baseUrl}/user`,
      method: "POST",
      body: { ...staff, active: "active" },
    });

    return { add: add, staff: staff };
  };

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setFormData({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      active: staff.status,
    });
    setShowDialog(true);
  };

  const handleCreate = () => {
    setSelectedStaff(null);
    setFormData({
      name: "",
      email: "",
      role: "staff",
      active: "active",
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (selectedStaff) {
      await updateStaff(formData);

      //console.log(response);
      toast.success(`${selectedStaff.name ?? selectedStaff.id} updated`);
      setShowDialog(false);
    } else {
      await addStaff(formData);

      toast.success("Staff member created");
      setShowDialog(false);
    }

    //toast.success(selectedStaff ? 'Staff member updated' : 'Staff member created');
  };

  const updateStaff = async (staff: Staff) => {
    console.log({ staff: staff });
    const update = await ApiRequest({
      url: `${baseUrl}/user`,
      method: "PUT",
      body: staff,
    });

    return { update: update, staff: staff };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/owner/dashboard")}
              className="p-2 -ml-2 active:scale-90 transition-transform"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg ml-2">Staff Management</h1>
          </div>
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {staff.map((staff: Staff) => (
            <div
              key={staff.id}
              onClick={() => handleEdit(staff)}
              className="bg-white dark:bg-gray-900 rounded-lg border p-4 active:scale-98 transition-transform cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm mb-1">{staff.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{staff.email}</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {staff.role}
                      </Badge>
                      <Badge
                        variant={
                          staff.status === "active" ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {staff.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedStaff ? "Edit Staff Member" : "Add Staff Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: any) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(v: any) =>
                  setFormData({ ...formData, role: v })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedStaff && (
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active Status</Label>
                <Switch
                  id="active"
                  checked={formData.active === "active"}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({
                      ...formData,
                      active: checked ? "active" : "inactive",
                    })
                  }
                />
              </div>
            )}
            <Button onClick={handleSave} className="w-full">
              {selectedStaff ? "Update Staff" : "Create Staff"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
