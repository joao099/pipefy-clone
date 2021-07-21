import React, { useRef, useContext } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { Container, Label } from './styles'
import BoardContext from '../Board/context'

export default function Card({ data, index, listIndex }) {
  const { move } = useContext(BoardContext)
  const ref = useRef()

  const [{ isDragging }, dragRef] = useDrag({
    type: 'CARD',
    item: { index, listIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      const draggedListIndex = item.listIndex
      const dropableListIndex = listIndex

      const draggedIndex = item.index
      const targetIndex = index

      if (draggedIndex === targetIndex && draggedListIndex === dropableListIndex) {
        return
      }

      const targetSize = ref.current.getBoundingClientRect()
      const targetCenter = (targetSize.bottom - targetSize.top) / 2

      const draggedOffset = monitor.getClientOffset()
      const draggedTop = draggedOffset.y - targetSize.top

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return
      }

      move(draggedListIndex, dropableListIndex, draggedIndex, targetIndex)

      item.index = targetIndex
      item.listIndex = dropableListIndex
    }
  })

  dragRef(dropRef(ref))

  return (
    <Container ref={ref} isDragging={isDragging} >
      <header>
        {data.labels.map(label => <Label key={label} color={label} />)}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt="" />}
    </Container>
  )
}
