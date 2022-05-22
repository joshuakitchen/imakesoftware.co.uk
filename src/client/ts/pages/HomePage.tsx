import React, { FC } from 'react'

const HomePage: FC<{}> = function () {
  return (
    <div className='content'>
      <h1>What is imakesoftware</h1>
      <p>Hello, my name is Josh.</p>
      <p>
        This is my project website, where I take you through the random projects
        which I work on extensively and passionately for about a day and then
        forget about and throw away.
      </p>
      <p>
        You may have noticed this looks unbelievably simple, the fact it's got
        TypeScript, React, SASS, a node backend and is dockerised should tell
        you exactly the kind of nutjob you're dealing with here.
      </p>
      <p>
        This will not be an organised website but a cacophany of chaos creating
        project after project after project which will ultimately result in none
        of them being finished and all of them being a little bit shit.
      </p>
    </div>
  )
}

export default HomePage
