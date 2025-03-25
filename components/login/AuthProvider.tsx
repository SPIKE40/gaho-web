"use client";

import { createContext, useState, useEffect, useCallback } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    loginWithMS: () => Promise<void>;
    handleLogin: (email: string, password: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loginWithMS: async () => {},
    handleLogin: () => {},
    logout: () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setAuthState] = useState<boolean>(false);

    // ✅ 초기 실행 시 localStorage에서 상태를 읽어옴
    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth === "true") {
            setAuthState(true);
        }
    }, []);

    const loginWithMS = useCallback(async () => {
        setAuthState(true);
        // localStorage.setItem("auth", "true"); // 🔥 로그인 시 localStorage 업데이트
        console.log("Microsoft 로그인 성공");
    }, []);

    const handleLogin = useCallback((email: string, password: string) => {
        if (email.trim() === "ktadmin" && password.trim() === "1234") {
            // localStorage.setItem("auth", "true");
            setAuthState(true);
            console.log("일반 로그인 성공");
        } else {
            console.log("로그인 실패");
        }
    }, []);

    const logout = useCallback(() => {
        setAuthState(false);
        // localStorage.removeItem("auth");
        console.log("로그아웃");
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loginWithMS, handleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
