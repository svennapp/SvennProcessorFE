import { Warehouse } from '../types'
import { Building2 } from 'lucide-react'

interface Props {
  warehouses: Warehouse[]
  selectedWarehouse: Warehouse | null
  onSelect: (warehouse: Warehouse) => void
}

export function WarehouseSelect({
  warehouses,
  selectedWarehouse,
  onSelect,
}: Props) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        Select Warehouse
      </label>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={selectedWarehouse?.id || ''}
        onChange={(e) => {
          const warehouse = warehouses.find((w) => w.id === e.target.value)
          if (warehouse) onSelect(warehouse)
        }}
      >
        <option value="">Select a warehouse...</option>
        {warehouses.map((warehouse) => (
          <option key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </option>
        ))}
      </select>
    </div>
  )
}
