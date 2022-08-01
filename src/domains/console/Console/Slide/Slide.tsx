import * as common from 'common'
import * as consoleSection from 'domains/console'
import * as View from './View'

export function Slide() {
  const { slideState, setSlideState } = consoleSection.useSchemaManager()

  return (
    <common.Slide
      open={slideState.open}
      setOpen={() => setSlideState({ ...slideState, open: false })}
      title={'Code exporter'}
      content={<View.CodeExporterView />}
    />
  )
}
