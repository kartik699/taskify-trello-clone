import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganisationPage() {
    return (
        <OrganizationList
            hidePersonal
            afterSelectOrganizationUrl="/organization/:id"
            afterCreateOrganizationUrl="/organization/:id"
        />
    );
}
