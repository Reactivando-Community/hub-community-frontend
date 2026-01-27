import { notFound } from 'next/navigation';

import { CommunityDetails } from '@/components/community-details';

interface CommunityPageProps {
    params: {
        id: string;
    };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
    const { id } = await params;

    if (!id) {
        notFound();
    }

    return <CommunityDetails slugOrId={id} />;
}
