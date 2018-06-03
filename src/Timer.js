import React from 'react';

export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {seconds: 25 * 60};
    }

    tick = () => {
        if (this.state.seconds - 1 === 0) {
            this.finishTimer();
        } else {
            this.setState({
                seconds: this.state.seconds - 1
            });
        }
    }

    startWork = () => {
        this.setState({
            seconds: 25 * 60,
            workRunning: true
        });
        this.startTimer();
    }

    startShortBreak = () => {
        this.setState({
            seconds: 5 * 60,
            workRunning: false
        });
        this.startTimer();
    }

    startLongBreak = () => {
        this.setState({
            seconds: 10 * 60,
            workRunning: false
        });
        this.startTimer();
    }

    playPause = () => {
        if (this.isRunning()) {
            this.stopTimer();
        } else {
            if (this.state.seconds === 0) {
                this.startWork();
            } else {
                this.startTimer();
            }
        }
    }

    fastForward = () => {
        if (this.isRunning()) {
            this.finishTimer();
        }
    }

    startTimer = () => {
        if (this.isRunning()) {
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

    finishTimer = () => {
        this.setState({
            seconds: 0
        });
        if (this.state.workRunning) {
            this.props.onWorkComplete();
        }
        this.stopTimer();
    }

    isRunning = () => {
        return !!this.state.intervalId;
    }
    
    render() {
        return (
            <div>
                <div className="row justify-content-md-center">
                    <div className="btn-group mt-2">
                        <button id="startWork" className="btn" onClick={ this.startWork } >Start work</button>
                        <button id="startShortBreak" className="btn" onClick={ this.startShortBreak } >Start short break</button>
                        <button id="startLongBreak" className="btn" onClick={ this.startLongBreak } >Start long break</button>
                    </div>
                </div>
                <div className="row justify-content-md-center">
                    <h1 id="timer">{ getFormattedTime(this.state.seconds) }</h1>
                </div>
                <div className="row justify-content-md-center">
                    <button id="playPause" className="btn" onClick={ this.playPause } >
                        <i className={"fa " + (this.isRunning() ? "fa-pause" : "fa-play")}/>
                    </button>
                    <button id="fastForward" className="btn" onClick={ this.fastForward } >
                        <i className="fa fa-fast-forward"/>
                    </button>
                </div>
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