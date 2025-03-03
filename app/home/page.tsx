"use client"
import { redirect } from "next/navigation";
import React from "react";

export default function Home() {
    return (
        <>
        <h1>This is home</h1>
        <button onClick={()=>{redirect("/login")}}>login</button>
        </>
    )
}