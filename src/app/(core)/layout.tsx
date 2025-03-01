import { UserProvider } from "@auth0/nextjs-auth0/client";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  )
}