"use client"
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Layout, Button } from "antd";

export default function Header(){
    
    const authContext = useContext(AuthContext);    

    // AuthContext가 undefined일 경우 예외 처리
    if (!authContext) {
        return null; // 또는 기본 UI 반환 가능
    }

    const { isAuthenticated, loginWithMS, logout } = authContext;

    return (
        <Layout.Header
        style={{
            padding: "0 16px",
            background: "white",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
        }}
        >

        {isAuthenticated ? (
            <Button type="primary" onClick={logout}>
                Sign out
            </Button>
        ) : (
            <Button onClick={loginWithMS}>Sign in</Button>
        )}
        </Layout.Header>
    );

}