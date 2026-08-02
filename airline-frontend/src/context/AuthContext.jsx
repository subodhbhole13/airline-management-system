import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skynex_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (userData) => {
    localStorage.setItem('skynex_user', JSON.stringify(userData))
    localStorage.setItem('token', userData.token)  // ✅ save token separately
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('skynex_user')
    localStorage.removeItem('token')               // ✅ clear token on logout
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}