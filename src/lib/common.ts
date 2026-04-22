/**
 * Core Event type exposed by the lib.
 *
 * Only `id`, `createdAt`, and `name` are required. Consumers can extend the
 * shape with any additional fields — the index signature keeps it open so the
 * app layer can add domain-specific data (location, severity, tags, etc.)
 * without changing the lib.
 */
export interface Event {
  id: string
  createdAt: string // ISO 8601
  name: string
  [field: string]: unknown
}
