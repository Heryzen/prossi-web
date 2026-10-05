"use client";

import { useEffect, useState } from "react";
import { getPageContent, type PageContentMap } from "@/lib/pageContent";

/**
 * Versi client dari getPageContent, untuk halaman "use client".
 * Mulai dengan map kosong (teks default tampil), lalu terisi setelah fetch selesai.
 */
export function usePageContent(keys: string[]): PageContentMap {
  const [map, setMap] = useState<PageContentMap>({});
  const keyList = keys.join(",");

  useEffect(() => {
    let active = true;
    getPageContent(keyList.split(",")).then((m) => {
      if (active) setMap(m);
    });
    return () => {
      active = false;
    };
  }, [keyList]);

  return map;
}
