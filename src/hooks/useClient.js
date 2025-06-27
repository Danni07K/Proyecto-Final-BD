'use client'
import { useState, useEffect } from 'react'

export function useClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        setStoredValue(initialValue)
      } else {
        if (key === 'token') {
          setStoredValue(item)
        } else {
          setStoredValue(JSON.parse(item))
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (isClient) {
        if (key === 'token') {
          window.localStorage.setItem(key, valueToStore)
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, isClient]
}

export function useAuth() {
  const [token, setToken] = useLocalStorage('token', null)
  const isClient = useClient()

  const login = (newToken) => {
    setToken(newToken)
  }

  const logout = () => {
    setToken(null)
    if (isClient) {
      window.location.href = '/login'
    }
  }

  const isAuthenticated = isClient && !!token

  return {
    token,
    isAuthenticated,
    login,
    logout,
    isClient
  }
} 