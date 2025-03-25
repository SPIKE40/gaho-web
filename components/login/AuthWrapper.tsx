"use client";

import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Navigation from "../navigation";
import Welcome from "./Welcome"
import { Layout } from "antd"

export default function AuthWrapper ({ children } : { children: React.ReactNode}){
    
    const authContext = useContext(AuthContext);

    console.log("authwrapper context:", authContext);

    if(!authContext){
        throw new Error("position error ");
    }

    const { isAuthenticated } = authContext;

    console.log("isAutenticated ", isAuthenticated);

    return (isAuthenticated ? (
        <Layout style={{ height: "100vh", display: "flex", flexDirection: "row"}}>
            <Navigation />
            <Layout>{children}</Layout>
        </Layout>
    ) : (
        <Welcome/>
    ));
}