"use client";

import DefaultPageLayout from "@/subframe/layouts/PageLayout";
import Feedback from "./Feedback";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ReactNode, useState } from "react";
import NotificationContext from "./NotificationContext";
import { Variant } from "./drawer/types";
import Notification from "./Notification";

export default function ScreenLoader(props: {children: ReactNode}) {
  const { user, error, isLoading } = useUser();
  const [greeting, setGreeting] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    title: "",
    variant: "success" as Variant
  });

  if ((!user && !isLoading)) {
    window.location.assign("/api/auth/login");
    return <Feedback message="User not authenticated, redirecting..." fullScreen/>
  }

  if (user && !isLoading && greeting)
    setTimeout(() => setGreeting(false), 1000);

  return (
    <>
     {
        error ? <Feedback message={error.message} error fullScreen/> :
        !user || isLoading ? <Feedback message="Loading, detecting user..." fullScreen/> :
        (user && !isLoading && greeting) ? <Feedback message={`Welcome ${user.name}!`} fullScreen/> :
        <DefaultPageLayout picture={user.picture as string} username={user.name as string}>
          <NotificationContext.Provider value={(title: string, variant: Variant) => setNotification({open: true, title, variant})}>
            {props.children}
            {
              notification.open &&
              <Notification
                title={notification.title}
                variant={notification.variant}
                onDispose={() => setNotification({...notification, open: false})}
              />
            }
          </NotificationContext.Provider>
        </DefaultPageLayout>
     }
    </>
  )
}
