type TourStepProps = {
  title: string
  content: string
}

export function TourStep({ title, content, ...props }: TourStepProps) {
  return (
    <div className="tour-wrapper" {...props}>
      <h3 className="tour-title">{title}</h3>
      <p className="tour-content">{content}</p>
    </div>
  )
}
