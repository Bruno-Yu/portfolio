import AdminPageHead from '@/components/Layout/BackStage/AdminPageHead'

// TODO: implement when contact form is added to frontstage
export default function MessagesPage() {
  return (
    <div>
      <AdminPageHead
        title="Messages"
        description="Contact form submissions from site visitors"
      />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>
        No messages yet.
      </p>
    </div>
  )
}
