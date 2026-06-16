// hooks/useFileUrl.ts
import { useState, useEffect } from "react";

export function useFileUrl(url: string) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("app_token"); // sau de unde iei tu token-ul
    let created = "";

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("401");
        return res.blob();
      })
      .then((blob) => {
        created = URL.createObjectURL(blob);
        setObjectUrl(created);
      })
      .catch(() => setObjectUrl(null));

    return () => {
      if (created) URL.revokeObjectURL(created);
    };
  }, [url]);

  return objectUrl;
}