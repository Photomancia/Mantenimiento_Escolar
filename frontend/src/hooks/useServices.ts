import { useContext } from 'react'
import type { Services } from '../services'
import { ServicesContext } from '../services/servicesContext'

export function useServices(): Services {
  const services = useContext(ServicesContext)
  if (!services) throw new Error('useServices debe usarse dentro de <ServicesProvider>.')
  return services
}
