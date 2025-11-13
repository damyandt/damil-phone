// components/ProtectedRoute.tsx
import { Redirect } from "expo-router";
import { useAuthedContext } from "../contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authedUser, authedUserLoading } = useAuthedContext();
  if (authedUserLoading) return null;
  if (!authedUser) return <Redirect href="/(auth)/login" />;
  return <>{children}</>;
}
