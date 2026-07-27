"use client";

import { useEffect, useState } from "react";

export default function BarcodeImg({ value }: { value: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) return;
    const canvas = document.createElement("canvas");
    import("jsbarcode").then(({ default: JsBarcode }) => {
      JsBarcode(canvas, value, {
        format: "CODE128",
        displayValue: false,
        margin: 6,
        width: 2,
        height: 52,
        lineColor: "#11151c",
        background: "#fdfaf3",
      });
      setDataUrl(canvas.toDataURL("image/png"));
      window.dispatchEvent(new CustomEvent("barcode-ready"));
    });
  }, [value]);

  if (!value || !dataUrl) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={dataUrl} alt={value} style={{ width: "100%", display: "block" }} />;
}
