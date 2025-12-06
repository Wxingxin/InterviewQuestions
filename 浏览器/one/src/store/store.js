// store.js
import { create } from '../lib/my-zustand.js'

const useStore = create((set) => ({
  count: 0,
  bears: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  addBears: (by) => set((state) => ({ bears: state.bears + by })),
}))

export default useStore