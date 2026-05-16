import type { ReactNode } from 'react'

interface AdminPageHeadProps {
  title: string
  description?: string
  children?: ReactNode  // right-aligned CTA(s)
}

/**
 * Shared page header for all admin pages.
 * Renders .admin-page-head with title, optional description,
 * and an optional right-side CTA slot (passed as children).
 */
export default function AdminPageHead({ title, description, children }: AdminPageHeadProps) {
  return (
    <div className="admin-page-head">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="admin-page-head__actions">{children}</div>}
    </div>
  )
}
