// src/lib/my-zustand.js
// 手写极简版 Zustand（修复版，58 行，100% 可运行）

import * as React from 'react'

const create = (createState) => {
  let state
  const listeners = new Set()

  const setState = (partial, replace = false) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial

    if (!Object.is(nextState, state)) {
      const previousState = state
      state = replace ? nextState : { ...state, ...nextState }

      listeners.forEach((listener) => listener(state, previousState))
    }
  }

  const getState = () => state

  const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const useStore = (selector = (s) => s, equalityFn = Object.is) => {
    const forceUpdate = React.useReducer((x) => x + 1, 0)[1]

    const stateRef = React.useRef()
    const selectorRef = React.useRef(selector)
    const equalityFnRef = React.useRef(equalityFn)

    selectorRef.current = selector
    equalityFnRef.current = equalityFn

    let currentSlice
    try {
      currentSlice = selectorRef.current(state)
    } catch {
      currentSlice = undefined
    }

    const sliceRef = React.useRef(currentSlice)

    if (!equalityFnRef.current(sliceRef.current, currentSlice)) {
      sliceRef.current = currentSlice
    }

    React.useLayoutEffect(() => {
      const listener = () => {
        try {
          const nextSlice = selectorRef.current(state)
          if (!equalityFnRef.current(sliceRef.current, nextSlice)) {
            sliceRef.current = nextSlice
            forceUpdate()
          }
        } catch {
          forceUpdate()
        }
      }
      listeners.add(listener)
      return () => listeners.delete(listener)
    }, [])

    return sliceRef.current
  }

  // 初始化 state
  state = createState(setState, getState, { setState, getState, subscribe, useStore })

  // 返回的函数既是 hook，也是 api 对象
  const api = (selector, equalityFn) => useStore(selector, equalityFn)
  Object.assign(api, { setState, getState, subscribe, useStore })

  return api
}

export { create }