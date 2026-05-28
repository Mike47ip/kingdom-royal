const STATUS = {
  PENDING:     { label: 'Pending Review', cls: 'bg-amber-100 text-amber-800'   },
  SEEN:        { label: 'Under Review',   cls: 'bg-blue-100 text-blue-800'     },
  NEGOTIATING: { label: 'In Discussion',  cls: 'bg-purple-100 text-purple-800' },
  CONFIRMED:   { label: 'Confirmed',      cls: 'bg-green-100 text-green-800'   },
  REJECTED:    { label: 'Not Available',  cls: 'bg-red-100 text-red-800'       },
  CANCELLED:   { label: 'Cancelled',      cls: 'bg-gray-100 text-gray-600'     },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS.PENDING
  return (
    <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
  )
}

export { STATUS }
