export function Separator({ className = '' }: { className?: string }) {
  return (
    <div
      className={`border-b border-gray-200 dark:border-dark-5 my-2 w-full ${className}`}
    />
  )
}
