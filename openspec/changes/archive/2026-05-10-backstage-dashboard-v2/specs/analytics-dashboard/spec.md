## ADDED Requirements

### Requirement: Backend analytics proxy fetches real CF Analytics data

The system SHALL expose `GET /api/admin/analytics?days=30` (admin JWT required) that queries the Cloudflare Analytics GraphQL API (`https://api.cloudflare.com/client/v4/graphql`) using secrets `CF_ANALYTICS_API_TOKEN` and `CF_ZONE_ID`. The query SHALL request `httpRequests1dGroups` for the specified number of days (default 30, max 90). The response SHALL be normalized to `{ totalRequests: number, uniqueVisitors: number, daily: [{ date: string, requests: number, uniques: number }] }`.

#### Scenario: Successful analytics fetch

- **WHEN** `GET /api/admin/analytics?days=30` is called with a valid admin JWT and CF credentials are configured
- **THEN** the system SHALL return `200` with a JSON body containing `totalRequests`, `uniqueVisitors` (summed across the period), and `daily` array with one entry per day

#### Scenario: Analytics API unavailable

- **WHEN** the Cloudflare Analytics GraphQL API returns an error or the request times out
- **THEN** `GET /api/admin/analytics` SHALL return `{ success: false, error: { code: "ANALYTICS_UNAVAILABLE" } }` with status `502`

#### Scenario: Missing CF credentials

- **WHEN** `CF_ANALYTICS_API_TOKEN` or `CF_ZONE_ID` is not configured in the Workers environment
- **THEN** `GET /api/admin/analytics` SHALL return `{ success: false, error: { code: "ANALYTICS_NOT_CONFIGURED" } }` with status `503`

#### Scenario: Unauthorized request rejected

- **WHEN** `GET /api/admin/analytics` is called without a JWT
- **THEN** the system SHALL return `401 Unauthorized`

### Requirement: Overview page displays four stat cards

The Overview page (`/backstage/overview`) SHALL display four stat cards: "Total visits" (30D total requests from CF Analytics), "Unique visitors" (30D unique visitors from CF Analytics), "Works published" (count from `GET /api/works`), and "Messages" (count from `GET /api/messages`). Each card SHALL display the metric label, value, and a period tick label.

#### Scenario: Stat cards render with API data

- **WHEN** `GET /api/admin/analytics` returns `{ totalRequests: 12486, uniqueVisitors: 3217, ... }` and `GET /api/works` returns 6 published works
- **THEN** the "Total visits" card SHALL display `12,486`, "Unique visitors" SHALL display `3,217`, and "Works published" SHALL display `6`

#### Scenario: Analytics unavailable shows empty state

- **WHEN** `GET /api/admin/analytics` returns `ANALYTICS_UNAVAILABLE`
- **THEN** the Total visits and Unique visitors cards SHALL display `—` (em dash) with a subtitle "Analytics unavailable"

### Requirement: Overview page displays 30-day sparkline chart

The Overview page SHALL render an SVG sparkline chart showing daily request counts for the past 30 days. The chart SHALL use an area fill with `--accent-y-soft` and a line stroke with `--ink`. Three axis labels SHALL appear below: "30D AGO", "15D", "TODAY".

#### Scenario: Sparkline renders from daily data

- **WHEN** `GET /api/admin/analytics` returns a `daily` array with 30 entries
- **THEN** the sparkline SVG SHALL render 30 data points connected by a smooth line with an area fill underneath

#### Scenario: Sparkline hidden when analytics unavailable

- **WHEN** `GET /api/admin/analytics` returns an error
- **THEN** the sparkline container SHALL display a plain text empty state ("No data available") instead of an SVG
