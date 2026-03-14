import axios from 'axios'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

function getBaseUrl(): string {
  if (Platform.OS === 'web') {
    return ''
  }
  const hostUri = Constants.expoConfig?.hostUri
  if (hostUri) {
    const host = hostUri.split(':')[0]
    return `http://${host}:8081`
  }
  return 'http://localhost:8081'
}

export const api = axios.create({ baseURL: getBaseUrl(), timeout: 8000 })
