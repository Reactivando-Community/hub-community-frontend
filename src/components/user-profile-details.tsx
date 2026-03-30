'use client';

import { useQuery } from '@apollo/client';
import {
    Calendar,
    ExternalLink,
    Github,
    Globe,
    Instagram,
    Linkedin,
    Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { FadeIn } from '@/components/animations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserProfileDetailsSkeleton } from '@/components/user-profile-details-skeleton';
import { GET_USER_BY_USERNAME } from '@/lib/queries';
import { UserProfileResponse } from '@/lib/types';

interface UserProfileDetailsProps {
    username: string;
}

function getInitials(str: string) {
    if (!str) return 'U';
    return str
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const socialLinks = [
    { key: 'instagram', icon: Instagram, color: 'text-pink-500', label: 'Instagram' },
    { key: 'twitter', icon: Twitter, color: 'text-sky-500', label: 'Twitter / X' },
    { key: 'linkedin', icon: Linkedin, color: 'text-blue-600', label: 'LinkedIn' },
    { key: 'github', icon: Github, color: 'text-foreground', label: 'GitHub' },
    { key: 'website', icon: Globe, color: 'text-emerald-500', label: 'Website' },
] as const;

export function UserProfileDetails({ username }: UserProfileDetailsProps) {
    const { data, loading, error } = useQuery<UserProfileResponse>(
        GET_USER_BY_USERNAME,
        { variables: { username } }
    );

    if (loading) {
        return <UserProfileDetailsSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center py-12 md:py-16">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        Erro ao carregar perfil
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Não foi possível carregar os detalhes do usuário.
                    </p>
                    <Button
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                window.location.reload();
                            }
                        }}
                    >
                        Tentar novamente
                    </Button>
                </div>
            </div>
        );
    }

    const user = data?.userByUsername;

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center py-12 md:py-16">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        Usuário não encontrado
                    </h2>
                    <p className="text-muted-foreground">
                        O usuário que você está procurando não existe ou foi
                        removido.
                    </p>
                </div>
            </div>
        );
    }

    const agenda = (user.agenda ?? []).filter((item: any) => item?.event);
    const displayName = (user as any).name || user.username;
    const userSocials = socialLinks.filter(s => (user as any)[s.key]);

    return (
        <FadeIn direction="up" duration={0.3}>
        <div className="min-h-screen bg-background">
            {/* Hero Section with Cover Photo */}
            <div className="relative overflow-hidden">
                {(user as any).cover_photo ? (
                    <Image
                        src={(user as any).cover_photo}
                        alt="Capa do perfil"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700" />
                )}
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

                <div className="relative container mx-auto px-4 sm:px-6 pt-12 pb-20 sm:pt-16 sm:pb-24">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-white/20 shadow-2xl">
                            <AvatarImage
                                src={user.speaker?.avatar}
                                alt={displayName}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-2xl sm:text-3xl text-white bg-white/20 backdrop-blur-sm">
                                {getInitials(displayName)}
                            </AvatarFallback>
                        </Avatar>

                        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4">
                            {displayName}
                        </h1>
                        <p className="text-white/80 text-sm sm:text-base mt-1">
                            @{user.username}
                        </p>
                        <Badge
                            variant="secondary"
                            className="mt-3 bg-white/15 text-white border-0 backdrop-blur-sm hover:bg-white/25"
                        >
                            Membro Ativo
                        </Badge>

                        {/* Social Links */}
                        {userSocials.length > 0 && (
                            <div className="flex items-center gap-3 mt-5">
                                {userSocials.map(social => {
                                    const Icon = social.icon;
                                    const url = (user as any)[social.key];
                                    return (
                                        <a
                                            key={social.key}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center h-10 w-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm transition-colors"
                                            title={social.label}
                                        >
                                            <Icon className="h-5 w-5 text-white" />
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 py-8 md:py-10 lg:py-12">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Events Section */}
                    <FadeIn direction="up" duration={0.35}>
                        <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
                            <div className="px-5 py-4 sm:px-6 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <h2 className="text-base font-semibold text-foreground">
                                        Eventos
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Eventos na agenda deste usuário
                                    </p>
                                </div>
                            </div>

                            <div className="px-5 sm:px-6 py-4 border-t border-border/40">
                                {agenda.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-4 text-center">
                                        Este usuário ainda não tem eventos na agenda.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                                        {agenda.map((item: any, index: number) => (
                                            <Link
                                                key={index}
                                                href={`/events/${item?.event?.documentId || ''}`}
                                                className="rounded-xl border border-border/50 overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="relative h-36 sm:h-40 w-full bg-muted">
                                                    {item?.event?.images &&
                                                    item?.event?.images.length > 0 ? (
                                                        <Image
                                                            src={item?.event?.images[0]}
                                                            alt={item?.event?.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-muted flex items-center justify-center">
                                                            <Calendar className="h-10 w-10 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3 sm:p-4 flex items-center justify-between">
                                                    <p className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                                        {item?.event?.title}
                                                    </p>
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0 ml-2" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </div>
        </FadeIn>
    );
}
