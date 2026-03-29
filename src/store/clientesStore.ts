import { clientesMock } from '@/mocks/clientes'
import type { Cliente } from '@/types/cliente'

// Module-level mutable Map — persists across navigation within the same session
export const clientesStore = new Map<string, Cliente>(
  clientesMock.map((c) => [c.id, { ...c }])
)
