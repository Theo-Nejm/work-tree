import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

import { firebaseDatabase } from '../../backend/config/firebaseConfig';

import { RiCloseFill } from 'react-icons/ri';
import { Container, TaskList, Title, RemoveModal } from './styled'
import Task from '../Task';
import AddTaskButton from '../AddTaskButton';
import EditColumnInput from '../EditColumnInput'

const dbRefference = firebaseDatabase.ref(`state`)

export default class Column extends React.Component {
  state = {
    idEditTitle: false,
    currentTitle: this.props.column.title,
    isAskRemove: false,
  }

  handleToggleEdit = () => {
    const newState = {
      ...this.state,
      isEditTitle: !this.state.isEditTitle
    }

    this.setState(newState)
  }

  removeSelf = async () => {
    const dbSnapshot = (await dbRefference.get(`state`)).val()

    if(Object.keys(dbSnapshot.columns).length <= 1) {
      toast.error('Você precisa ter pelo menos uma coluna na sua Work Tree.')
      this.setState({
        ...this.state,
        isAskRemove: false,
      })

      return;
    }

    dbSnapshot.columnOrder.splice(dbSnapshot.columnOrder.indexOf(this.props.column.id), 1)

    const tasksToDelete = dbSnapshot.columns[this.props.column.id].taskIds ? dbSnapshot.columns[this.props.column.id].taskIds : null

    if(dbSnapshot.tasks && tasksToDelete) {
      for(let task of tasksToDelete) {
        dbSnapshot.tasks[task] = null;
      }
    }
    dbSnapshot.columns[this.props.column.id] = null;

    console.log(dbSnapshot.columns)

    dbRefference.set(dbSnapshot);
  }

  handleEditTitle = async (event) => {
    event.preventDefault()
    const newTitle = document.querySelector(`.${this.props.column.id}`).value;
    if(!newTitle) {

      this.setState({
        isEditTitle: !this.state.isEditTitle,
        isAskRemove: true,
      })
      return;
    }

    const newState = {
      currentTitle: newTitle,
      isEditTitle: !this.state.isEditTitle,
    }
    const dbSnapshot = (await dbRefference.get(`state`)).val()
    dbSnapshot.columns[this.props.column.id].title = newTitle;
    const newData = dbSnapshot;

    dbRefference.set(newData)
    this.setState(newState)
  }

  render() {
  return (
    <>
    <Draggable draggableId={this.props.column.id} index={this.props.index}>
      {provided => (
        <Container
          {...provided.draggableProps}
          innerRef={provided.innerRef}
          ref={provided.innerRef}
          tasks={this.props.tasks}
        >
          {
            !this.state.isEditTitle ?
            <Title onClick={this.handleToggleEdit} {...provided.dragHandleProps}>
            {this.state.currentTitle}
            </Title> :
            <EditColumnInput
              handleBlur={this.handleToggleEdit}
              handleSubmit={this.handleEditTitle}
              classValue={this.props.column.id}
            />
          }
          <Droppable droppableId={this.props.column.id} type="task">
            {(provided, snapshot) => (
              <TaskList
                innerRef={provided.innerRef}
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {this.props.tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
          <AddTaskButton
            index={this.props.column.id}
            handleAddTask={this.props.handleAddTask}
            handleClickAddTask={this.props.handleClickAddTask}
          />
        </Container>
      )}
    </Draggable>
    {
      this.state.isAskRemove
      ? <RemoveModal>
        <div className="modal-wrapper">
          <div className="text">
            <h3>Você tem certeza?</h3>
            <p>
              Confirmar irá excluir a coluna e os {this.props.tasks.length} cards que estão nela!
            </p>
          </div>
          <div className="actions">
            <button
              onClick={() => this.setState({ ...this.state, isAskRemove: !this.state.isAskRemove })}
            >
              <RiCloseFill />
              Cancelar
            </button>
            <button
              onClick={this.removeSelf}
            >
              Confirmar
            </button>
          </div>

        </div>
      </RemoveModal>
      : null
    }
    </>
  );
}
}


