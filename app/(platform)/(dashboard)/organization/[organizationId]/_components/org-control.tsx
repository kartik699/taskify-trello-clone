"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

export default function OrgControl() {
    const { organizationId } = useParams();
    const { setActive } = useOrganizationList();

    useEffect(() => {
        if (!setActive) return;

        setActive({
            organization: organizationId as string,
        });
    }, [organizationId, setActive]);

    return null;
}
