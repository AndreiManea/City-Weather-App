interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cityName?: string;
}

export function DeleteDialog({ open, onClose, onConfirm, cityName }: DeleteDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 rounded-2xl"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl ring-1 ring-white/10 shadow-2xl p-6 space-y-4 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-100">Delete City</h2>
          <p className="text-gray-300">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-white">{cityName}</span>?
          </p>
          <p className="text-sm text-gray-400">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            className="px-4 py-2 rounded-lg bg-neutral-800 text-gray-200 ring-1 ring-white/10 hover:bg-neutral-700 transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-b from-red-600 to-red-500 text-white ring-1 ring-white/10 hover:shadow-red-500/20 hover:brightness-110 active:brightness-95 transition-all duration-200"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
