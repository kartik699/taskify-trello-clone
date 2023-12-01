import { Logo } from "@/components/logo";

export const Navbar = () => {
    return (
        <div className="fixed top-0 w-full h-14 px-4 border-b flex items-center shadow-sm bg-white">
            <div className="md:max-w-screen-xl mx-auto flex items-center w-full justify-between">
                <Logo />
            </div>
        </div>
    );
};
