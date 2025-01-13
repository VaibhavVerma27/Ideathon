import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignOutPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div>
      <h5>Are you sure you want to sign out?</h5>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
