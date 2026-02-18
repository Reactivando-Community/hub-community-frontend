import { notFound } from 'next/navigation';

import { UserProfileDetails } from '@/components/user-profile-details';

interface UserPageProps {
    params: Promise<{ username: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
    const { username } = await params;

    if (!username) {
        notFound();
    }

    return <UserProfileDetails username={username} />;
}
