"use client";

import DefaultPageLayout from "@/subframe/layouts/PageLayout";
import Feedback from "./Feedback";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ReactNode } from "react";

export default function ScreenLoader(props: {children: ReactNode}) {
  const { user, error, isLoading } = useUser();

  if ((!user && !isLoading)) {
    window.location.assign("/api/auth/login");
    return <Feedback message="User not authenticated. Redirecting..."/>
  }

  return (
    <>
     {
       error ? <Feedback message={error.message} error/> :
       !user || isLoading ? <Feedback message="Loading, Detecting user..."/> :
       <DefaultPageLayout>{props.children}</DefaultPageLayout>
     }
    </>
  )
}
