"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IUser } from "common-types";
import { authService, LoginCredentials, SignupData, OtpData } from "@/services/auth.service";

/**
 * Auth Context Type
 */
interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  sendOtp: (mobile: string) => Promise<void>;
  verifyOtp: (data: OtpData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // بارگذاری اطلاعات کاربر هنگام mount
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * مقداردهی اولیه auth - بررسی token و دریافت اطلاعات کاربر
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // بررسی وجود token در localStorage
      const token = authService.getToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // دریافت اطلاعات کاربر از API
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ورود به سیستم
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
    } catch (error) {
      console.error("Login error in context:", error);
      throw error;
    }
  };

  /**
   * ثبت‌نام
   */
  const signup = async (data: SignupData): Promise<void> => {
    try {
      const response = await authService.signup(data);
      setUser(response.data.user);
    } catch (error) {
      console.error("Signup error in context:", error);
      throw error;
    }
  };

  /**
   * ارسال OTP
   */
  const sendOtp = async (mobile: string): Promise<void> => {
    try {
      await authService.sendOtp(mobile);
    } catch (error) {
      console.error("Send OTP error in context:", error);
      throw error;
    }
  };

  /**
   * تأیید OTP و ورود
   */
  const verifyOtp = async (data: OtpData): Promise<void> => {
    try {
      const response = await authService.verifyOtp(data);
      setUser(response.data.user);
    } catch (error) {
      console.error("Verify OTP error in context:", error);
      throw error;
    }
  };

  /**
   * خروج از سیستم
   */
  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  /**
   * به‌روزرسانی اطلاعات کاربر
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Refresh user error:", error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    sendOtp,
    verifyOtp,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook - استفاده از Auth Context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
