import { UserProvider } from "@auth0/nextjs-auth0/client";
import ScreenLoader from "./components/ScreenLoader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <ScreenLoader>{children}</ScreenLoader>
    </UserProvider>
  )
}