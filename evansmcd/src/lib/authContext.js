import { createContext } from 'react'

// Shared login state. Use the useAuth() hook to read it, see src/lib/useAuth.js
export const AuthContext = createContext(null)
