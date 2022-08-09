import { render, screen } from '@testing-library/react'
import { ContentSection } from '.'
import '@testing-library/jest-dom'

describe('ContentSection', () => {
  it('should render the ContentSection', () => {
    render(
      <ContentSection title="Content Section">ContentSection</ContentSection>
    )

    const contentChildren = screen.getByText('ContentSection')

    expect(contentChildren).toBeInTheDocument()
  })

  it('should render the ContentSection content with a variant', () => {
    render(
      <ContentSection
        title="Content Section"
        variant="WithoutTitleBackgroundColor"
      />
    )

    const contentTitle = screen.queryByText('Content Section')

    expect(contentTitle).toBeInTheDocument()
  })
})
