import * as common from 'common'
import * as consoleSection from 'domains/console'
import * as View from './View'
import * as Update from './Update'

export function Slide() {
  const { slideState, setSlideState } = consoleSection.useSchemaManager()

  return (
    <common.Slide
      open={slideState.open}
      setOpen={() => setSlideState({ ...slideState, open: false })}
      title={
        slideState.type === 'CodeExporterView'
          ? 'Code exporter'
          : 'Endpoint and resquest headers'
      }
      content={
        slideState.type === 'CodeExporterView' ? (
          <View.CodeExporterView />
        ) : (
          <Update.EndpointAndResquestHeadersView />
        )
      }
    />
  )
}
