// Use this import if you want to use "env.js" file
// const { API_URL } = require("../../config/env")z
// Or just specify it directly like this:
// import Config from 'react-native-config';
const API_URL = "https://hermes-dot-ilead-2021.et.r.appspot.com"
// const API_URL = "https://ilead-2021.et.r.appspot.com/"

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  // url:  Config.API_URL || API_URL,
  url: API_URL,
  timeout: 10000,
}
