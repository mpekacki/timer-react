import React from 'react';

export default class TaskInput extends React.Component {
    handleInput = (event) => {
        this.props.onInput(event.target.value);
    }

    handleDescriptionInput = (event) => {
        this.props.onDescriptionInput(event.target.value);
    }

    render() {
        return (
            <div className="row">
                <div className="input-group mt-3 mb-3">
                    <input type="text" className="form-control" id="taskInput" value={ this.props.value } onInput={ this.handleInput }/>
                    {this.props.createNewTaskVisible && 
                        <input type="text" className="form-control" id="taskDescription" onInput={ this.handleDescriptionInput } placeholder="New task description (optional)" />
                    }
                </div>
            </div>
        );
    }
}