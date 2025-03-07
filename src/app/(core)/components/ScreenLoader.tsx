"use client";

import DefaultPageLayout from "@/subframe/layouts/PageLayout";
import Feedback from "./Feedback";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ReactNode } from "react";

export default function ScreenLoader(props: {children: ReactNode}) {
  const { user, error, isLoading } = useUser();

  if ((!user && !isLoading)) {
    window.location.assign("/api/auth/login");
    return <Feedback message="User not authenticated. Redirecting..." fullScreen/>
  }

  return (
    <>
     {
       error ? <Feedback message={error.message} error fullScreen/> :
       !user || isLoading ? <Feedback message="Loading, detecting user..." fullScreen/> :
       <DefaultPageLayout picture={user.picture as string} username={user.name as string}>{props.children}</DefaultPageLayout>
     }
    </>
  )
}
