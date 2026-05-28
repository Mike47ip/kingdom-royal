export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-9 h-9 rounded-full border-2 border-warm-border border-t-gold animate-spin-slow" />
      <p className="text-warm-gray text-sm">{label}</p>
    </div>
  )
}
