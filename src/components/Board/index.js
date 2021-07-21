import React, { useState } from 'react'
import { produce } from 'immer'

import { loadLists } from '../../services/api'
import BoardContext from './context'
import List from '../List'
import { Container } from './styles'

const data = loadLists()

export default function Board() {
  const [lists, setLists] = useState(data)

  function move(fromList, toList, from, to) {
    setLists(produce(lists, fakeList => {
      const dragged = fakeList[fromList].cards[from]

      fakeList[fromList].cards.splice(from, 1)
      fakeList[toList].cards.splice(to, 0, dragged)
    }))
  }

  return (
    <BoardContext.Provider value={{
      lists,
      move
    }}>
      <Container>
        {lists.map((list, index) => <List key={list.title} index={index} data={list} />)}
      </Container>
    </BoardContext.Provider>
  )
}
