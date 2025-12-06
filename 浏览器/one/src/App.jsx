import { use, useState } from 'react'

import useStore from './store/store.js'

function App() {
  const count = useStore(state => state.count)
  const increment = useStore(state => state.increment)

  return (
    <>
      <button onClick={increment} >{count}</button>
    </>
  )
}

export default App
