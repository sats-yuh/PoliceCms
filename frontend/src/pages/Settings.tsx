import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, XCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [themeDark, setThemeDark] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [appPush, setAppPush] = useState(true);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and system behavior</p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Basic account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="you@example.com" type="email" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value="Investigator" disabled />
            </div>
            <div>
              <Label htmlFor="lastLogin">Last Login</Label>
              <Input id="lastLogin" value="2025-07-12 10:45 AM" disabled />
            </div>
          </div>
          <Button variant="police">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Theme & Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize look and feel</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <Label>Dark Mode</Label>
            <p className="text-sm text-muted-foreground">Enable dark theme for UI</p>
          </div>
          <Switch checked={themeDark} onCheckedChange={setThemeDark} />
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Protect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Two-Factor Authentication (2FA)</Label>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-muted-foreground">Send code to registered email</p>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="New password" />
            </div>
          </div>
          <Button variant="police">Update Security</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control how you're notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive emails for new reports & tasks</p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>SMS Alerts</Label>
              <p className="text-sm text-muted-foreground">Critical updates via SMS</p>
            </div>
            <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>App Push</Label>
              <p className="text-sm text-muted-foreground">Receive push alerts on mobile app</p>
            </div>
            <Switch checked={appPush} onCheckedChange={setAppPush} />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Be cautious with these actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Deactivate Account</p>
              <p className="text-sm text-muted-foreground">You can reactivate it anytime</p>
            </div>
            <Button variant="outline">Deactivate</Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanent, irreversible action</p>
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" /> Confirm Deletion
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <p>Please enter a reason for deleting your account (optional):</p>
                  <Textarea
                    placeholder="I am leaving because..."
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                  />
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => alert('Account Deleted')}>
                      <XCircle className="h-4 w-4 mr-1" /> Confirm Delete
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
