
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  CreditCard,
  MessageCircleQuestion,
  Languages,
  Bell,
  Sun,
  Moon,
  Users,
  LogOut,
  FlaskConical,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Badge } from './ui/badge';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/tests', label: 'Tests', icon: FlaskConical },
  { href: '/fees', label: 'Fee Management', icon: CreditCard },
  { href: '/notifications', label: 'Notifications', icon: MessageCircleQuestion },
  { href: '/users', label: 'User Management', icon: Users },
];

const studentNavItems = [
    { href: '/student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/tests', label: 'Tests', icon: FlaskConical },
    { href: '/my-fees', label: 'My Fees', icon: CreditCard },
];

function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const [theme, setTheme] = React.useState('light');
  const router = useRouter();

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setTheme(isDarkMode ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="flex w-full items-center justify-end gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Languages className="size-5" />
              <span className="sr-only">Change language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>मराठी (Marathi)</DropdownMenuItem>
            <DropdownMenuItem>हिन्दी (Hindi)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <Badge className="absolute -right-1 -top-1 h-4 w-4 justify-center p-0 text-xs" variant="destructive">3</Badge>
            <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person portrait" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function MainSidebar() {
    const pathname = usePathname();
    const [userType, setUserType] = React.useState<string | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUserType(userData.type);
        }
    }, [pathname]);

    // Choose nav items based on user type
    const currentNavItems = userType === 'student' ? studentNavItems : navItems;
    const homeUrl = userType === 'student' ? '/student-dashboard' : '/dashboard';


    return (
        <Sidebar>
            <SidebarHeader className="p-2">
                <Link href={homeUrl} className="flex items-center gap-2.5">
                    <Icons.logo className="size-8 text-primary" />
                    <span className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">ShikshaSetu</span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>
                    {currentNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={item.label}
                            >
                                <Link href={item.href}>
                                    <item.icon className="size-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <MainSidebar />
        <SidebarInset>
            <AppHeader />
            <main className="flex-1 p-4 sm:p-6 bg-background/80">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
