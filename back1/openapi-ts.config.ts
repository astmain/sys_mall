import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  // input: 'http://127.0.0.1:3001/common-json',
  input: './openapi.json',
  output: './api_axios',
})
