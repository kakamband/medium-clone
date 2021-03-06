import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { LOCAL_TOKEN } from '../config'
import { ServerError } from '../types'
import { useLocalStorage } from './useLocalStorage'


export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: {
    [key: string]: any
  }
}

interface FetchHookResult<T> {
  doFetch: (options?: FetchOptions) => void
  data?: T
  isLoading: boolean
  isError: boolean
  error?: ServerError
}


export function useFetch<T>(url: string): FetchHookResult<T> {

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState()
  const [error, setError] = useState<ServerError>()
  const [options, setOptions] = useState<FetchOptions>({})
  const [token] = useLocalStorage(LOCAL_TOKEN)

  
  const doFetch = useCallback((options: FetchOptions = {}) => {
    setError(undefined)
    setOptions(options)
    setIsLoading(true)
  }, [])
  
  useEffect(() => {
    if (!isLoading) {
      return
    }

    const baseUrl = process.env.REACT_APP_API_BASE
    const cancelTokenSource = axios.CancelToken.source()
    const requestOptions = {
      ...options,
      headers: {
        authorization: token ? `Token ${token}`: ''
      }
    }

    axios(baseUrl + url, requestOptions)
    .then( res => {
      setData(res.data)
      setError(undefined)
    })
    .catch(err => {
      const error = new ServerError(err.message)
      if (err.response && err.response.data !== null 
        && typeof err.response.data === 'object') 
      {
        error.errors = err.response.data.errors
      }
      
      setError(error)
    })
    .finally(() => setIsLoading(false))
    
    return () => {
      cancelTokenSource.cancel()
    }
  }, [options, isLoading, token, url])

  return {
    doFetch,
    data,
    isLoading,
    isError: !!error,
    error
  }
}
