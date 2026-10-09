import { createContext } from 'react'
import type { Services } from '.'

export const ServicesContext = createContext<Services | null>(null)
