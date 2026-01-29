export type User = {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  isVerified: boolean
}

const USERS_KEY = "geruestbauer_users"

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(USERS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return []
    }
  }
  return []
}

export function saveUsers(users: User[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
}

export function createUser(email: string, password: string, name: string): User | null {
  const users = getAllUsers()
  
  // Check if user already exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return null
  }
  
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
    isVerified: false
  }
  
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function authenticateUser(email: string, password: string): User | null {
  const users = getAllUsers()
  return users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  ) || null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("currentUser")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return null
    }
  }
  return null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
  }
}

export function logoutUser(): void {
  setCurrentUser(null)
}
