'use client';

import { useQuery } from '@apollo/client';
import { Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useFilters } from '../contexts/filter-context';
import { GET_TAGS } from '../lib/queries';
import { TagsResponse } from '../lib/types';

export function SearchAndFilters() {
  const { searchTerm, selectedTags, setSearchTerm, toggleTag, clearFilters } =
    useFilters();

  const { data } = useQuery<TagsResponse>(GET_TAGS);

  const tags = data?.tags?.data || [];

  const hasActiveFilters = searchTerm || selectedTags.length > 0;

  return (
    <div className="bg-card rounded-lg shadow-md p-6 mb-12 border">
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Buscar por nome da comunidade ou evento..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag?.value) ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            onClick={() => toggleTag(tag?.value)}
          >
            {tag?.value}
          </Badge>
        ))}
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              Filtros ativos:
            </span>
            {searchTerm && (
              <Badge variant="secondary" className="text-sm">
                Busca: &quot;{searchTerm}&quot;
              </Badge>
            )}
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
