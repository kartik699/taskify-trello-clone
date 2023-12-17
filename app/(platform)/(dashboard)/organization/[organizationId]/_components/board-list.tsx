import { FormPopover } from "@/components/form/form-popover";
import Hint from "@/components/hint";
import { HelpCircle, User2 } from "lucide-react";

export default function BoardList() {
    return (
        <div className="space-y-4">
            <div className="flex items-center text-lg text-neutral-700 font-semibold">
                <User2 className="h-6 w-6 mr-2" />
                Your Boards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <FormPopover sideOffset={10} side="right">
                    <div
                        role="button"
                        className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
                    >
                        <p className="text-sm">Create New Board</p>
                        <span className="text-xs">5 Remaining</span>
                        <Hint
                            sideOffset={45}
                            description={`Free Workspaces can have upto 5 boards. For unlimited boards, please upgrade this workspace`}
                        >
                            <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
                        </Hint>
                    </div>
                </FormPopover>
            </div>
        </div>
    );
}
