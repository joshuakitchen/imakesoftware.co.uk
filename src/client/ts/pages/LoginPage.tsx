import axios from 'axios'
import React, { FC, useState } from 'react'

const LoginPage: FC<{}> = function LoginPage() {
  const [state, setState] = useState({ email: '', password: '' })
  return (
    <div className='content'>
      <form>
        <input
          name='email'
          type='text'
          placeholder='Email'
          value={state.email}
          onChange={(e) => {
            setState((state) => ({ ...state, email: e.target.value }))
          }}
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={state.password}
          onChange={(e) => {
            setState((state) => ({ ...state, password: e.target.value }))
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault()

            axios.post('/login/', state).then(function _onSuccess(res) {
              window.location.href = '/'
            })
          }}
        >
          Sign-In
        </button>
      </form>
    </div>
  )
}

export default LoginPage
