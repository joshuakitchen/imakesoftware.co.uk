import React, {
  useState,
  SetStateAction,
  createContext,
  useContext,
  FC,
  ReactNode,
} from 'react'
import ReactDOM from 'react-dom'

export const useLocalStorage = function useLocalStorage<S>(
  key: string,
  initial_state: S
): [S, React.Dispatch<SetStateAction<S>>] {
  if (localStorage.getItem(key)) {
    initial_state = JSON.parse(localStorage.getItem(key))
  }
  const [state, setState] = useState(initial_state)
  return [
    state,
    function setLocalStorage(arg: S | ((prevState: S) => S)) {
      if (typeof arg === 'function') {
        setState((prevState) => {
          const newState = (arg as Function)(prevState)
          localStorage.setItem(key, JSON.stringify(newState))
          return newState
        })
      } else {
        localStorage.setItem(key, JSON.stringify(arg))
        setState.apply(this, arguments)
      }
    },
  ]
}

function getMeta(name: string) {
  const tags = document.getElementsByTagName('meta')
  for (let i = 0; i < tags.length; i++) {
    if (tags[i].name === name) {
      const content = JSON.parse(atob(tags[i].content))
      tags[i].remove()
      return content
    }
  }
  return null
}

const UserContext = createContext<{ email: string }>(getMeta('token'))

export const useUser = function useUser() {
  return useContext(UserContext)
}

export const Portal: FC<{ children?: ReactNode }> = function Portal(props) {
  return ReactDOM.createPortal(
    props.children,
    document.getElementsByTagName('body')[0]
  )
}
