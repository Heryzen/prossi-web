import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";
import BarcodeImg from "./BarcodeImg";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

type Address = { name: string; phone: string; detail: string; district: string; city: string; province: string; postal: string };
type OrderItem = { name: string; qty: number; price: number };
type Order = {
  order_number: string; guest_name: string; guest_phone: string;
  items: OrderItem[]; total: number; shipping_cost: number;
  shipping_courier: string; shipping_service: string;
  tracking_number: string | null; address: Address | null; date_created: string;
};

async function getOrder(orderNumber: string): Promise<Order | null> {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/orders?filter[order_number][_eq]=${encodeURIComponent(orderNumber)}&fields=*&limit=1`,
      { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
    );
    const json = await res.json();
    return json?.data?.[0] ?? null;
  } catch { return null; }
}

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function LabelPage({ params }: { params: Promise<{ order_number: string }> }) {
  const { order_number } = await params;
  const order = await getOrder(order_number);
  if (!order) notFound();

  const addr = order.address;
  const courier = (order.shipping_courier ?? "").toUpperCase();
  const service = (order.shipping_service ?? "").toUpperCase();
  const originName = process.env.SHIPPING_ORIGIN_CONTACT_NAME ?? "Prossi Clinic";
  const originAddress = process.env.SHIPPING_ORIGIN_ADDRESS ?? "Jl. Bintaro Utama 3A, Bintaro Jaya Sektor 3, Pesanggrahan";
  const originPhone = process.env.SHIPPING_ORIGIN_CONTACT_PHONE ?? "";

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #label-root, #label-root * { visibility: visible; }
          #label-root {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
          }
          @page { size: A6 portrait; margin: 8mm; }
        }

        /* Screen styles */
        #label-page-wrap {
          background: #f0f0f0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 24px;
          gap: 24px;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .label-btn-row { display: flex; gap: 12px; align-items: center; }
        .label-back {
          background: white; color: #11151c; text-decoration: none;
          border: 1.5px solid #dde3f0; padding: 11px 22px;
          border-radius: 100px; font-size: 14px; font-weight: 600;
          font-family: 'Inter', system-ui, sans-serif;
        }
        #label-root {
          background: white;
          width: 100mm;
          border: 1.5px solid #222;
          box-shadow: 0 6px 32px rgba(0,0,0,0.13);
          font-family: 'Inter', system-ui, sans-serif;
        }
        .lb-header {
          background: #11151c; padding: 12px 16px;
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .lb-header img { height: 34px; object-fit: contain; filter: brightness(0) invert(1); }
        .lb-badge {
          background: #b59637; color: white; font-size: 12px; font-weight: 800;
          padding: 5px 12px; border-radius: 4px; letter-spacing: 0.05em; white-space: nowrap;
        }
        .lb-resi {
          background: #fdfaf3; border: 1.5px solid #b59637; border-radius: 5px;
          margin: 12px 14px 4px; padding: 10px 14px; text-align: center;
        }
        .lb-resi-label {
          font-size: 8px; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: #b59637; margin-bottom: 5px;
        }
        .lb-resi-num {
          font-family: 'Courier New', monospace; font-size: 19px;
          font-weight: 800; color: #11151c; letter-spacing: 0.06em; word-break: break-all;
        }
        .lb-divider { border: none; border-top: 1px dashed #ddd; margin: 0 14px; }
        .lb-section { padding: 10px 14px; }
        .lb-section + .lb-section { border-top: 1px dashed #e8e8e8; }
        .lb-lbl { font-size: 8px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #999; margin-bottom: 4px; }
        .lb-name { font-size: 13px; font-weight: 700; color: #11151c; line-height: 1.3; }
        .lb-sub { font-size: 11px; color: #444; line-height: 1.6; }
        .lb-items { list-style: none; margin-top: 4px; }
        .lb-items li { font-size: 10px; color: #555; padding: 2px 0; border-bottom: 1px solid #f4f4f4; }
        .lb-items li:last-child { border-bottom: none; }
        .lb-footer {
          background: #11151c; padding: 8px 14px;
          display: flex; justify-content: space-between; align-items: center; margin-top: 2px;
        }
        .lb-footer-left { font-size: 9px; color: #888; letter-spacing: 0.06em; }
        .lb-footer-right { font-size: 11px; font-weight: 700; color: #b59637; }
      `}</style>

      <div id="label-page-wrap">
        <div className="label-btn-row">
          <a href={`/admin/orders/${order_number}`} className="label-back">← Kembali</a>
          <PrintButton hasTracking={!!order.tracking_number} />
        </div>

        <div id="label-root">
          {/* Header */}
          <div className="lb-header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/imgUntitledDesign181.webp" alt="Prossi Clinic" />
            <div className="lb-badge">{courier} {service}</div>
          </div>

          {/* Resi */}
          <div className="lb-resi">
            <div className="lb-resi-label">Nomor Resi</div>
            <div className="lb-resi-num">
              {order.tracking_number ?? "—"}
            </div>
            {order.tracking_number && (
              <div style={{ marginTop: "8px" }}>
                <BarcodeImg value={order.tracking_number} />
              </div>
            )}
          </div>

          <hr className="lb-divider" />

          {/* Kepada */}
          <div className="lb-section">
            <div className="lb-lbl">Kepada</div>
            <div className="lb-name">{addr?.name ?? order.guest_name}</div>
            <div className="lb-sub">{addr?.phone ?? order.guest_phone}</div>
            {addr && (
              <div className="lb-sub">
                {[addr.detail, addr.district, addr.city, addr.province].filter(Boolean).join(", ")}
                {addr.postal ? ` ${addr.postal}` : ""}
              </div>
            )}
          </div>

          {/* Dari */}
          <div className="lb-section">
            <div className="lb-lbl">Dari</div>
            <div className="lb-name">{originName}</div>
            {originPhone && <div className="lb-sub">{originPhone}</div>}
            <div className="lb-sub">{originAddress}</div>
          </div>

          {/* Isi paket */}
          <div className="lb-section">
            <div className="lb-lbl">Isi Paket</div>
            <ul className="lb-items">
              {order.items?.map((item, i) => (
                <li key={i}>{item.name} ×{item.qty}</li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="lb-footer">
            <span className="lb-footer-left">#{order.order_number} · {fmtDate(order.date_created)}</span>
            <span className="lb-footer-right">{rupiah(order.total)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
