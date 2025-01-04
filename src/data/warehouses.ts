import { Warehouse } from '../types'

export const warehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Byggmakker',
    scripts: [
      {
        id: '1',
        name: 'Base Byggmakker Processor',
        status: 'active',
      },
      {
        id: '3',
        name: 'Byggmakker Retailer Processor',
        status: 'active',
      },
      {
        id: '4',
        name: 'Byggmakker Store Processor',
        status: 'active',
      },
      {
        id: '5',
        name: 'Byggmakker Store Prices Processor',
        status: 'active',
      },
    ],
  },
]
