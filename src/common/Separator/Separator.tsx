export function Separator({ className = '' }: { className?: string }) {
  return (
    <div
      className={`border-b border-gray-200 dark:border-gray-700 w-full my-2 ${className}`}
    />
  )
}
