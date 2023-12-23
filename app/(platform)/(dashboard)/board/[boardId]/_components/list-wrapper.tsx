interface ListWrapperProps {
    children: React.ReactNode;
}

export default function ListWrapper({ children }: ListWrapperProps) {
    return (
        <li className="shrink-0 h-full w-[272px] select-none">{children}</li>
    );
}
