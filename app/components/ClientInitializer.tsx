'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeAuthFromCookie } from '../utils/auth'

export default function ClientInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    initializeAuthFromCookie(dispatch)
  }, [dispatch])

  return null
}