import React from 'react';
import TaskInput from './TaskInput';
import AvailableTasks from './AvailableTasks';

export default class TaskManager extends React.Component {
    render() {
        return (
            <div>
                <TaskInput value={ this.props.searchText } onInput={ this.props.handleTaskInput } onDescriptionInput={ this.props.handleDescriptionInput } createNewTaskVisible={ this.props.createNewTaskVisible }/>
                <AvailableTasks tasks={ this.props.tasks } matchingTasks={ this.props.matchingTasks } searchText={ this.props.searchText } createTask={ this.props.createTask } selectTask={ this.props.selectTask } createNewTaskVisible={ this.props.createNewTaskVisible }/>
            </div>
        );
    }
}