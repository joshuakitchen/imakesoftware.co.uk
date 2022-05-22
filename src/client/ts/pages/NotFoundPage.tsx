import React, { FC } from 'react'

const NotFoundPage: FC<{}> = function NotFoundPage() {
  return (
    <div className='content'>
      <h1>Four-O-Four</h1>
      <p>
        The page you are looking for could not be found, maybe it's under
        construction, maybe it's a type, or quite possibly it doesn't exist.
      </p>
    </div>
  )
}

export default NotFoundPage
