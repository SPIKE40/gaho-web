"use client";

import { Button } from "antd";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export default function Welcome() {

    const authContext = useContext(AuthContext);
    
    if (!authContext || !authContext.handleLogin) {
        console.error("handleLogin is not available in AuthContext");
        return null;
    }

    const { handleLogin } = authContext;

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "linear-gradient(to right, #a8c0ff, #3f2b96)"
        }}>
            <h1 style={{ textAlign: "center", marginBottom: "10px" }}>Welcome to AI Playground</h1>
            <p style={{ textAlign: "center", marginBottom: "20px" }}>Please log in to continue</p>

            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.2)",
                padding: "20px",
                borderRadius: "10px"
            }}>
                <input
                    type="text"
                    placeholder="Email"
                    style={{ padding: "10px", marginBottom: "10px", width: "250px", textAlign: "center", borderRadius: "5px", border: "1px solid #ccc" }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    style={{ padding: "10px", marginBottom: "20px", width: "250px", textAlign: "center", borderRadius: "5px", border: "1px solid #ccc" }}
                />

                <Button type="primary" size="large" onClick={() => handleLogin("ktadmin", "1234")}>
                    Login
                </Button>
            </div>
        </div>
    );
}
