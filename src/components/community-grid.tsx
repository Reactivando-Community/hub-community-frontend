'use client';

import { useQuery } from '@apollo/client';
import { Calendar, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { StaggerContainer, StaggerItem } from '@/components/animations';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFilters } from '@/contexts/filter-context';
import { GET_COMMUNITIES } from '@/lib/queries';
import { CommunitiesResponse, Community, Tag } from '@/lib/types';

import { adjustToBrazilTimezone, getNextFutureEvents } from '../utils/event';

export function CommunityGrid({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const { debouncedSearchTerm } = useFilters();

  const { data, error } = useQuery<CommunitiesResponse>(GET_COMMUNITIES, {
    variables: {
      filters: debouncedSearchTerm ? { title: { contains: 'over' } } : {},
    },
    fetchPolicy: 'network-only',
  });

  const communities = data?.communities?.data || [];

  // Call the onCountChange callback if provided
  React.useEffect(() => {
    if (onCountChange) {
      onCountChange(communities.length);
    }
  }, [onCountChange, communities.length]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Erro de Conexão
          </h3>
          <p className="text-red-600 mb-4">
            Não foi possível conectar ao servidor GraphQL. Verifique se o
            servidor está rodando.
          </p>
          <details className="text-sm text-red-500">
            <summary className="cursor-pointer">Detalhes do erro</summary>
            <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  const nextFutureEvents = getNextFutureEvents(
    communities.flatMap(community => community.events || [])
  );

  if (communities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {debouncedSearchTerm
            ? 'Nenhuma comunidade encontrada com os filtros aplicados.'
            : 'Nenhuma comunidade disponível no momento.'}
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {communities?.map((community: Community) => {
        const imageSrc = community.images?.[0] || '/placeholder.svg';

        return (
          <StaggerItem key={community.id}>
            <Link href={`/communities/${community.slug}`} className="block group h-full">
              <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                {/* Image with dark mask for contrast */}
                <div className="relative bg-zinc-900 overflow-hidden h-48">
                  <Image
                    src={imageSrc}
                    alt={
                      typeof community.title === 'string'
                        ? community.title
                        : 'Community'
                    }
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                    suppressHydrationWarning
                  />
                </div>

                {/* Info */}
                <CardContent className="flex flex-col flex-1 p-4">
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {typeof community.title === 'string'
                      ? community.title
                      : 'Título não disponível'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {typeof community.short_description === 'string'
                      ? community.short_description
                      : 'Descrição não disponível'}
                  </p>

                  {/* Tags */}
                  {community.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {community.tags.map((tag: Tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                          {typeof tag.value === 'string' ? tag.value : 'Tag'}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="mt-auto space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      {typeof community.members_quantity === 'number'
                        ? `${community.members_quantity} membros`
                        : '0 membros'}
                    </div>
                    {!!nextFutureEvents?.length && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        Próximo evento:{' '}
                        {adjustToBrazilTimezone(
                          new Date(nextFutureEvents[0].start_date)
                        ).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
