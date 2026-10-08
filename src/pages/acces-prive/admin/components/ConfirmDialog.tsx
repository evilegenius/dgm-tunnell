interface ConfirmDialogProps {
  title: string;
  message: string;
  busy?: boolean;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  busy = false,
  confirmLabel = "Supprimer",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-[#232334] bg-[#12121b] p-6">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-[#ff5470]/40 bg-[#ff5470]/10">
          <i className="ri-delete-bin-6-line text-lg text-[#ff5470]" />
        </div>
        <h3 className="font-heading text-base font-bold uppercase tracking-wide text-[#e8e8f0]">{title}</h3>
        <p className="mt-2 text-sm text-[#8b8b9e]">{message}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="whitespace-nowrap rounded-md border border-[#232334] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#3a3a52] hover:text-[#e8e8f0] cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#ff5470]/50 bg-[#ff5470]/15 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#ff5470] transition-colors hover:bg-[#ff5470]/25 disabled:opacity-60 cursor-pointer"
          >
            {busy ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-delete-bin-6-line" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}