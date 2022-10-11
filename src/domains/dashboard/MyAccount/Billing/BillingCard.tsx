export type BillingCardProps = {
  projectName: String
}

export function BillingCard({ projectName }: BillingCardProps) {
  return <p>{projectName}</p>
}
