import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div className="m-4">
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In With CLerk</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Home;
