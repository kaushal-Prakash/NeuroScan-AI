"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
  ScanSearch,
} from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check authentication status on every page
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/is-authenticated`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const userData = response.data.user;
          setIsLoggedIn(true);
          setUserData(userData);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`,{
        withCredentials: true,
      });
      setIsLoggedIn(false);
      setUserData(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items
  const navItems = [
    { name: "Home", href: "/home" },
    { name: "About", href: "/about-us" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <ScanSearch className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">Thorax AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                isActiveLink(item.href)
                  ? "text-primary"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {item.name}
              {isActiveLink(item.href) && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          {isLoading ? (
            <div className="h-9 w-20 bg-muted rounded-md animate-pulse"></div>
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/home" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              {/* Mobile Navigation */}
              <div className="flex-1 py-6">
                <div className="flex items-center px-2 pb-6">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                    <ScanSearch className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="ml-2 font-bold text-xl">Thorax AI</span>
                </div>

                <nav className="grid gap-2">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center py-2 px-3 rounded-md text-base font-medium center text-center w-full transition-colors ${
                          isActiveLink(item.href)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="border-t pt-4 pb-6">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                    <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                  </div>
                ) : isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userData?.email || "user@example.com"}
                      </p>
                    </div>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center py-2 px-3 rounded-md text-base font-medium text-foreground/60 hover:text-foreground w-full"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/account"
                        className="flex items-center py-2 px-3 rounded-md text-base font-medium text-foreground/60 hover:text-foreground w-full"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Account
                      </Link>
                    </SheetClose>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <SheetClose asChild>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Login</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;
