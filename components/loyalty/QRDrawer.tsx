"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, ScanLine } from "lucide-react";

interface QRDrawerProps {
  userId: string;
  name: string;
  points: number;
}

export function QRDrawer({ userId, name, points }: QRDrawerProps) {
  const [open, setOpen] = useState(false);

  // Short code the staff types in — first 8 chars of UUID
  const shortCode = userId.slice(0, 8).toUpperCase();
  const qrValue = `schwindbräu://user/${userId}`;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-3 flex items-center justify-center gap-2 text-[11px] font-semibold tracking-wide text-white/60 hover:text-white/90 transition-colors py-2 rounded-xl border border-white/10 hover:border-white/20"
      >
        <ScanLine className="w-3.5 h-3.5" />
        Karte dem Personal zeigen
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-sm mx-auto p-6 pb-10 space-y-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label text-[var(--color-muted)]">Treuekarte</p>
                <p className="font-bold text-lg text-[var(--color-text)] mt-0.5">{name}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center hover:bg-[var(--color-surface-3)] transition-colors"
              >
                <X className="w-4 h-4 text-[var(--color-muted)]" />
              </button>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-4 py-2">
              <div
                className="p-4 bg-white rounded-2xl"
                style={{ boxShadow: "0 2px 16px rgba(28,20,8,0.12)" }}
              >
                <QRCodeSVG
                  value={qrValue}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#1A1408"
                  level="M"
                />
              </div>
              <div className="text-center space-y-1">
                <p className="font-mono text-2xl font-bold tracking-widest text-[var(--color-text)]">
                  {shortCode}
                </p>
                <p className="text-xs text-[var(--color-muted)]">Code ans Personal zeigen oder scannen lassen</p>
              </div>
            </div>

            {/* Points summary */}
            <div className="bg-[var(--color-accent-light)] rounded-2xl px-5 py-3 flex items-center justify-between">
              <span className="text-sm text-[var(--color-muted)]">Aktuelles Guthaben</span>
              <span className="font-black text-xl text-[var(--color-accent)]">{points} Pkt.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
