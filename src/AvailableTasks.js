import React from 'react';
import Task from './Task';
import CreateNewTask from './CreateNewTask';

export default class AvailableTasks extends React.Component {
    setCreateNewTaskVisible = (value) => {
        this.props.setCreateNewTaskVisible(value);
    }

    render() {
        let createNewBtn = null;
        if (this.props.createNewTaskVisible) {
            createNewBtn = <CreateNewTask taskName={ this.props.searchText } createTask={ this.props.createTask }/>;
        }

        return (
            <div className="row">
                {createNewBtn}
                {this.props.matchingTasks.map((task, i) => <Task task={task} selectTask={this.props.selectTask} key={i}/>)}
            </div>
        );
    }
}