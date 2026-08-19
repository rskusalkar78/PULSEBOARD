import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Badge,
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  Drawer,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownHeader,
  Tooltip,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  Skeleton,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
  ToastProvider,
  useToast,
  EmptyState,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Progress,
  Separator,
} from '@/components/ui';

import {
  Plus,
  Moon,
  Sun,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  FolderPlus,
  Inbox,
  Filter,
} from 'lucide-react';

const ShowcaseContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [switchState, setSwitchState] = useState(true);
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioValue, setRadioValue] = useState('pro');
  const [progressVal] = useState(65);

  const { toast } = useToast();

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-12 transition-colors duration-200">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">PulseBoard Design System</h1>
            <Badge variant="primary">v1.0.0</Badge>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            26 TypeScript-first, accessible, responsive, dark-mode compatible UI primitives.
          </p>
        </div>

        <Button
          variant="outline"
          leftIcon={isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
            01. Breadcrumb & Navigation
          </h2>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Design System</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink isCurrentPage>Primitives Showcase</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </section>

        {/* Buttons & IconButtons */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            02. Buttons & Icon Buttons
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Variants & Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">
                    Primary Small
                  </Button>
                  <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
                    Primary Medium
                  </Button>
                  <Button variant="primary" size="lg" rightIcon={<Plus className="h-4 w-4" />}>
                    Primary Large
                  </Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="link">Link Button</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Loading States</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button isLoading variant="primary">
                    Saving...
                  </Button>
                  <Button isLoading variant="outline">
                    Processing
                  </Button>
                  <IconButton
                    icon={<Bell />}
                    aria-label="Notifications"
                    isLoading
                    variant="secondary"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Icon Buttons</h4>
                <div className="flex items-center gap-3">
                  <IconButton
                    icon={<Plus className="h-4 w-4" />}
                    aria-label="Add"
                    variant="primary"
                    size="sm"
                  />
                  <IconButton
                    icon={<Search className="h-4 w-4" />}
                    aria-label="Search"
                    variant="secondary"
                    size="md"
                  />
                  <IconButton
                    icon={<Bell className="h-4 w-4" />}
                    aria-label="Alerts"
                    variant="outline"
                    size="lg"
                  />
                  <IconButton
                    icon={<Settings className="h-4 w-4" />}
                    aria-label="Settings"
                    variant="ghost"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Form Controls */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            03. Form Inputs & Controls
          </h2>
          <Card>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="John Doe"
                leftAddon={<User className="h-4 w-4" />}
                helperText="Enter your display name"
              />
              <Input
                label="Email Address"
                placeholder="john@example.com"
                error="Invalid email format"
                required
              />

              <Select
                label="Role / Permission"
                placeholder="Select role..."
                options={[
                  { value: 'admin', label: 'Administrator' },
                  { value: 'editor', label: 'Editor' },
                  { value: 'viewer', label: 'Viewer' },
                ]}
              />

              <Textarea label="Bio / Notes" placeholder="Write a short summary..." rows={3} />

              <div className="space-y-4">
                <Checkbox
                  label="Accept terms & conditions"
                  checked={checkboxState}
                  onChange={(e) => setCheckboxState(e.target.checked)}
                />
                <Checkbox label="Indeterminate checkbox state" indeterminate />
              </div>

              <div className="space-y-4">
                <Switch
                  label="Enable Automatic Updates"
                  description="Receive instant security patches"
                  checked={switchState}
                  onChange={(e) => setSwitchState(e.target.checked)}
                />
              </div>

              <div className="col-span-full">
                <RadioGroup
                  label="Subscription Tier"
                  value={radioValue}
                  onChange={setRadioValue}
                  orientation="horizontal"
                >
                  <Radio value="starter" label="Starter" description="Free forever" />
                  <Radio value="pro" label="Pro Tier" description="$19 / month" />
                  <Radio value="enterprise" label="Enterprise" description="Custom quote" />
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges & Avatars */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            04. Badges, Avatars & Progress
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Badges</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary" dot>
                    Primary Dot
                  </Badge>
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                  <Badge variant="warning">Pending</Badge>
                  <Badge variant="danger" onDismiss={() => alert('Dismissed')}>
                    Dismissible
                  </Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Avatars</h4>
                <div className="flex items-center gap-4">
                  <Avatar size="sm" name="Alex Morgan" status="online" />
                  <Avatar size="md" name="Sarah Connor" status="busy" />
                  <Avatar size="lg" name="Ethan Hunt" status="away" />
                  <AvatarGroup max={3}>
                    <Avatar name="User One" />
                    <Avatar name="User Two" />
                    <Avatar name="User Three" />
                    <Avatar name="User Four" />
                  </AvatarGroup>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Progress Bars</h4>
                <div className="space-y-3 max-w-md">
                  <Progress value={progressVal} showLabel variant="primary" />
                  <Progress value={85} variant="success" size="lg" />
                  <Progress indeterminate variant="warning" size="sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Overlay Primitives */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            05. Dialog, Drawer, Dropdown & Tooltip
          </h2>
          <Card>
            <CardContent className="pt-6 flex flex-wrap items-center gap-4">
              <Button onClick={() => setIsDialogOpen(true)}>Open Modal Dialog</Button>
              <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
                Open Drawer Panel
              </Button>

              <Dropdown>
                <DropdownTrigger>
                  <Button variant="secondary" rightIcon={<Filter className="h-4 w-4" />}>
                    Dropdown Menu
                  </Button>
                </DropdownTrigger>
                <DropdownContent align="left">
                  <DropdownHeader>Actions</DropdownHeader>
                  <DropdownItem icon={<User className="h-4 w-4" />}>View Profile</DropdownItem>
                  <DropdownItem icon={<Settings className="h-4 w-4" />}>Settings</DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem icon={<LogOut className="h-4 w-4" />} danger>
                    Log Out
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>

              <Tooltip content="This is a floating tooltip!" position="top">
                <Button variant="ghost">Hover For Tooltip</Button>
              </Tooltip>

              <Button
                variant="primary"
                onClick={() =>
                  toast({
                    title: 'System Update',
                    message: 'PulseBoard Design System tokens successfully loaded.',
                    variant: 'success',
                  })
                }
              >
                Trigger Toast
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Tabs & Tables */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            06. Tabs & Table
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Avatar size="sm" name="Jane Cooper" />
                          <span>Jane Cooper</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success" dot>
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Avatar size="sm" name="Cody Fisher" />
                          <span>Cody Fisher</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="warning" dot>
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell>Developer</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={5}
                    onPageChange={setCurrentPage}
                    showPageDetails
                    totalItems={50}
                    itemsPerPage={10}
                  />
                </TabsContent>
                <TabsContent value="analytics">
                  <p className="text-sm text-slate-500 p-4">Analytics view content panel.</p>
                </TabsContent>
                <TabsContent value="settings">
                  <p className="text-sm text-slate-500 p-4">Settings view content panel.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Feedback & Skeleton */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            07. Alerts, Spinner, Skeleton & Empty State
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Alert variant="info" onClose={() => alert('Closed')}>
                <AlertTitle>New Feature Available</AlertTitle>
                <AlertDescription>PulseBoard Design System tokens are live!</AlertDescription>
              </Alert>

              <Alert variant="warning">
                <AlertTitle>Storage Limit Warning</AlertTitle>
                <AlertDescription>Your workspace is approaching 90% capacity.</AlertDescription>
              </Alert>

              <div className="flex items-center gap-4 p-4 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" variant="primary" />
                <span className="text-sm text-slate-500">Loading spinners...</span>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                </div>
                <Skeleton variant="rectangular" height={100} />
              </CardContent>
            </Card>
          </div>

          <EmptyState
            icon={<Inbox className="h-8 w-8" />}
            title="No Projects Found"
            description="Get started by creating your first workspace project."
            action={<Button leftIcon={<FolderPlus className="h-4 w-4" />}>Create Project</Button>}
          />
        </section>
      </div>

      {/* Modal Dialog */}
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to apply changes to the design token palette?
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            This action will recalculate theme variable references.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} side="right">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Drawer Settings
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Adjust preferences dynamically.
        </p>
        <Separator label="General" />
        <div className="space-y-4 my-4">
          <Input label="Workspace Name" defaultValue="PulseBoard Prod" />
          <Switch label="Dark Mode Sync" checked={isDarkMode} onChange={toggleDarkMode} />
        </div>
      </Drawer>
    </div>
  );
};

export const DesignSystemPage: React.FC = () => (
  <ToastProvider>
    <ShowcaseContent />
  </ToastProvider>
);

export default DesignSystemPage;
