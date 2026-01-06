import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserCog } from 'lucide-react';
import { mockStaff, Staff } from '../../data/mockData';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

export function OwnerStaff() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    status: 'active'
  });

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      status: staff.status
    });
    setShowDialog(true);
  };

  const handleCreate = () => {
    setSelectedStaff(null);
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      status: 'active'
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    toast.success(selectedStaff ? 'Staff member updated' : 'Staff member created');
    setShowDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <button onClick={() => navigate('/owner/dashboard')} className="p-2 -ml-2 active:scale-90 transition-transform">
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
          {mockStaff.map(staff => (
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
                      <Badge variant="secondary" className="text-xs">{staff.role}</Badge>
                      <Badge variant={staff.status === 'active' ? 'default' : 'destructive'} className="text-xs">
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
            <DialogTitle>{selectedStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedStaff && (
              <div className="flex items-center justify-between">
                <Label htmlFor="status">Active Status</Label>
                <Switch
                  id="status"
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                />
              </div>
            )}
            <Button onClick={handleSave} className="w-full">
              {selectedStaff ? 'Update Staff' : 'Create Staff'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
