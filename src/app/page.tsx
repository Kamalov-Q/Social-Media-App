import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div className="m-4">
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In With CLerk</Button>
        </SignInButton>
        <ModeToggle />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <Button variant={"outline"} className="ml-2">
        Click me
      </Button>
    </div>
  );
};

export default Home;
