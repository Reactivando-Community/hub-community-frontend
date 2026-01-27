import { notFound } from 'next/navigation';

import { EventDetails } from '@/components/event-details';

interface EventPageProps {
    params: {
        id: string;
    };
}

export default async function EventPage({ params }: EventPageProps) {
    const { id } = await params;

    if (!id) {
        notFound();
    }

    return <EventDetails slugOrId={id} />;
}
