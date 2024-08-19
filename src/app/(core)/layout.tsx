import { UserProvider } from "@auth0/nextjs-auth0/client";
import { NotifiablePage, ScreenLoading } from "./components"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <ScreenLoading>
        <NotifiablePage>{children}</NotifiablePage>
      </ScreenLoading>
    </UserProvider>
  )
}