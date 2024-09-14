import { ReactNode } from "react";
import {
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";

interface ProtectedPageProps {
  children: ReactNode;
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {user && (
        <div>
          <h1>Protected Page</h1>
          {children}
        </div>
      )}
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
