import { useState } from 'react'
import { FirstStep } from './FirstStep'
import { SecondStep } from './SecondStep'

export function ChangePassword() {
  const [recoverStep, setRecoverStep] = useState(0)
  const [username, setUsername] = useState('')

  return (
    <>
      {recoverStep === 0 ? (
        <FirstStep setRecoverStep={setRecoverStep} setUsername={setUsername} />
      ) : (
        <SecondStep setRecoverStep={setRecoverStep} username={username} />
      )}
    </>
  )
}
