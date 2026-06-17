import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { File, FileText, FileImage, FileSpreadsheet } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { useDashboard } from "../../hooks/useDashboard";

function getFileIcon(mimetype: string) {
  if (mimetype.startsWith("image/")) return FileImage;
  if (mimetype.includes("spreadsheet") || mimetype.includes("excel")) return FileSpreadsheet;
  if (mimetype.includes("pdf") || mimetype.includes("word")) return FileText;
  return File;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function RecentFiles() {
  const { t } = useTranslation();
  const { files, isLoading, error } = useDashboard();

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("dashboard.files.title", "Fișiere recente")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive font-medium">
          {t("dashboard.files.error", "Nu am putut încărca fișierele:")} {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t("dashboard.files.title", "Fișiere recente")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))
        ) : files.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.files.empty", "Niciun fișier încărcat recent.")}
          </p>
        ) : (
          files.map((file) => {
            const Icon = getFileIcon(file.mimetype);
            return (
              <div key={file.id} className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{file.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.uploadedBy?.name ?? t("dashboard.files.unknownUser", "Necunoscut")} · {formatSize(file.size)} ·{" "}
                    {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true, locale: ro })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}