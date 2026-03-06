'use client';

import { FadeIn } from '@/components/animations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RichText } from '@/components/ui/rich-text';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_COMMENTS } from '@/lib/queries';
import { CommentsResponse } from '@/lib/types';
import { useQuery } from '@apollo/client';
import { MessageSquare, RefreshCw, User } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface CommentsListProps {
  talkId: string;
}

function CommentSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const CommentsList = forwardRef<
  { refetch: () => void },
  CommentsListProps
>(function CommentsList({ talkId }, ref) {
  const { data, loading, error, refetch } = useQuery<CommentsResponse>(
    GET_COMMENTS,
    {
      variables: { talkId },
    }
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Erro ao carregar comentários</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const comments = data?.comments?.data || [];

  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum comentário ainda</p>
            <p className="text-sm">
              Seja o primeiro a comentar sobre esta palestra!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="text-lg font-semibold">
            Comentários ({comments.length})
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {comments.map((comment, index) => (
        <FadeIn key={index} direction="up" delay={index * 0.05}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="Usuário" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-foreground">
                    {comment.user?.username || 'Usuário Anônimo'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    • há alguns instantes
                  </span>
                </div>

                <div className="prose prose-sm max-w-none">
                  <RichText content={comment.comment} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </FadeIn>
      ))}
    </div>
  );
});
