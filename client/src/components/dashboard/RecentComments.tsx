import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { useDashboard } from "../../hooks/useDashboard";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RecentComments() {
  const { t } = useTranslation();
  const { comments, isLoading, error } = useDashboard();

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("dashboard.comments.title", "Comentarii recente")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive font-medium">
          {t("dashboard.comments.error", "Nu am putut încărca comentariile:")} {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t("dashboard.comments.title", "Comentarii recente")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-10 flex-1 rounded-md" />
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.comments.empty", "Niciun comentariu recent pe proiectele tale.")}
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-muted text-muted-foreground font-medium">
                  {initials(comment.author.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-0.5 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{comment.author.name}</span>
                  {comment.project && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      {t("dashboard.comments.inProject", "în {{projectName}}", { projectName: comment.project.name })}
                    </span>
                  )}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{comment.content}</p>
                <p className="text-xs text-muted-foreground pt-0.5">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ro })}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}