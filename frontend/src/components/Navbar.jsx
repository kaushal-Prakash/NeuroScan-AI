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
  Brain,
  FileText,
  History,
  BookOpen,
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
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      setUserData(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items for NeuroScan AI
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      name: "About",
      href: "/about-us",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      name: "Services",
      href: "/services",
      icon: <ScanSearch className="h-4 w-4" />,
    },
    {
      name: "Contact",
      href: "/contact",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NeuroScan AI
            </span>
            <span className="text-xs text-gray-500 -mt-1">
              Brain Tumor Detection
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative flex items-center gap-2 group ${
                isActiveLink(item.href)
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`transition-transform group-hover:scale-110 ${
                  isActiveLink(item.href) ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              {item.name}
              {isActiveLink(item.href) && (
                <motion.div
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoading ? (
            <div className="flex space-x-3">
              <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <Button
                asChild
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <Link href="/services">
                  <ScanSearch className="h-4 w-4 mr-2" />
                  New Scan
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full text-white text-xs font-bold">
                      {userData?.name?.charAt(0) || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {userData?.email || "user@example.com"}
                      </p>
                      {userData?.role === "doctor" && (
                        <Badge variant="secondary" className="mt-1 w-fit">
                          Medical Professional
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-blue-600"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="border border-gray-200"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] p-0 border-l border-gray-200"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">NeuroScan AI</span>
                    <p className="text-xs text-gray-500">
                      Brain Tumor Detection
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 py-4 px-4">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center py-3 px-4 rounded-lg text-base font-medium transition-all ${
                          isActiveLink(item.href)
                            ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`mr-3 ${
                            isActiveLink(item.href)
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t p-6 space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                ) : isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full text-white text-sm font-bold">
                        {userData?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {userData?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userData?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1">
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Link href="/services">
                            <ScanSearch className="h-4 w-4 mr-2" />
                            New Scan
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                    <SheetClose asChild>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Link href="/signup">Get Started Free</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}

                {/* Contact Info */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    Need help?{" "}
                    <Link
                      href="/contact"
                      className="text-blue-600 hover:underline"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;
