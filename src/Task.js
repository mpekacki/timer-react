import React from 'react';

export default class Task extends React.Component {
    onClick = () => {
        this.props.selectTask(this.props.task.name);
    }

    render() {
        let task = this.props.task;
        return <a className={"btn task" + (task.selected ? ' selected' : '')} onClick={ this.onClick } style={ { backgroundColor : task.color } } title={ task.description }>{task.name}</a>;
    }
}