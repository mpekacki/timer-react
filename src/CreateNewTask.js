import React from 'react';

export default class CreateNewTask extends React.Component {
    createTask = () => {
        this.props.createTask();
    }

    render() {
        return <a id="createNewTask" className="btn" onClick={ this.createTask }>{'Create new task "' + this.props.taskName + '"'}</a>;
    }
}