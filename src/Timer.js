import React from 'react';

export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {seconds: 25 * 60};
    }

    tick = () => {
        if (this.state.seconds - 1 === 0) {
            this.stopTimer();
        }
        this.setState({
            seconds: this.state.seconds - 1
        });
    }

    startWork = () => {
        this.setState({
            seconds: 25 * 60
        });
        this.startTimer();
    }

    startShortBreak = () => {
        this.setState({
            seconds: 5 * 60
        });
        this.startTimer();
    }

    startLongBreak = () => {
        this.setState({
            seconds: 10 * 60
        });
        this.startTimer();
    }

    playPause = () => {
        if (this.state.intervalId) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer = () => {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }
        let intervalId = setInterval(
            () => this.tick(), 
            1000
        );
        this.setState({
            intervalId: intervalId
        });
    }

    stopTimer = () => {
        clearInterval(this.state.intervalId);
        this.setState({
            intervalId: null
        });
    }
    
    render() {
        return (
            <div>
                <button id="startWork" onClick={ this.startWork } >Start work</button>
                <button id="startShortBreak" onClick={ this.startShortBreak } >Start short break</button>
                <button id="startLongBreak" onClick={ this.startLongBreak } >Start long break</button>
                <span id="timer">{ getFormattedTime(this.state.seconds) }</span>
                <button id="playPause" onClick={ this.playPause } >Play/pause</button>
            </div>
        );
    }
}

function getFormattedTime(timerSeconds) {
    let minutes = String(Math.floor(timerSeconds / 60));
    let seconds = String(timerSeconds % 60);
    if (minutes.length < 2) {
        minutes = '0' + minutes;
    }
    if (seconds.length < 2) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}