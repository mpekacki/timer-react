import React, { Component } from 'react';
import './App.css';
import TaskManager from './TaskManager';
import Timer from './Timer';
import Calendar from './Calendar';
import LocalStorageDataProvider from './localStorageDataProvider';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.dataProvider = this.props.dataProvider || new LocalStorageDataProvider();
    let allTasks = this.getAvailableTasks(this.dataProvider);
    this.state = {
      searchText: '',
      enteredDescription: '',
      createNewTaskVisible: false,
      tasks: allTasks,
      matchingTasks: allTasks,
      weekOffset: 0,
      entries: this.getEntries(this.dataProvider)
    };
    this.getPermission();
    this.audio = new Audio('sound.mp3');
  }

  getAvailableTasks = (dataProvider) => {
    let tasks = dataProvider.getAllTasks();
    tasks.unshift({name: 'No task', selected: true});
    return tasks;
  }

  getEntries = (dataProvider, weekOffset) => {
    let entries = {};
    let startDate = moment().startOf('isoWeek');
    if (weekOffset) {
      startDate.add(weekOffset, 'weeks');
    }
    [...Array(7).keys()].forEach(i => {
      let day = startDate.clone().add(i, 'days').format('YYYY-MM-DD');
      entries[day] = dataProvider.getEntriesForDay(day) || [];
    });
    return entries;
  }

  setSelectedTask = (taskName) => {
    let tasks = this.state.tasks;
    tasks.forEach((task) => {
      if (task.name === taskName) {
        task.selected = true;
      } else if (task.selected) {
        task.selected = false;
      }
    });
    this.setState({
      tasks: tasks
    });
  }

  getSelectedTask = () => {
    return this.state.tasks.find(task => task.selected);
  }

  createTask = () => {
    let tasks = this.state.tasks;
    let taskName = this.state.searchText
    let task = {
      name: taskName,
      description: this.state.enteredDescription,
      color: this.getRandomColor()
    }
    tasks.splice(1, 0, task);
    this.setState({
      tasks: tasks
    });
    this.handleTaskInput('');
    this.handleDescriptionInput('');
    this.setSelectedTask(taskName);
    this.dataProvider.saveTask(task);
  }

  handleTaskInput = (inputValue) => {
    let tasks = this.state.tasks;

    let matchingTasks = [];
    let perfectMatch = false;
    let createNewTaskVisible = false;

    if (inputValue === '') {
      matchingTasks = tasks;
      createNewTaskVisible = false;
    } else {
      let searchTextUpper = inputValue.toUpperCase();
      tasks.forEach(task => {
        let taskNameUpper = task.name.toUpperCase();
        if (taskNameUpper === 'NO TASK' || taskNameUpper.indexOf(searchTextUpper) !== -1) {
          matchingTasks.push(task);
        }
        if (taskNameUpper === searchTextUpper) {
          perfectMatch = true;
        }
      });
      createNewTaskVisible = !perfectMatch;
    }

    this.setState({
      createNewTaskVisible: createNewTaskVisible,
      matchingTasks: matchingTasks,
      searchText: inputValue
    });
  }

  handleDescriptionInput = (inputValue) => {
    this.setState({
      enteredDescription: inputValue
    });
  }

  decrementWeek = () => {
    this.setWeekOffset(this.state.weekOffset - 1);
  }

  incrementWeek = () => {
    this.setWeekOffset(this.state.weekOffset + 1);
  }

  setWeekOffset = (newWeekOffset) => {
    this.setState({
      weekOffset: newWeekOffset,
      entries: this.getEntries(this.dataProvider, newWeekOffset)
    });
  }

  onWorkComplete = () => {
    this.showNotification();
    let selectedTask = this.getSelectedTask();
    let date = moment().format('YYYY-MM-DD');
    let time = moment().format('HH:mm');
    let newEntry = {
      taskName: selectedTask.name,
      date: date,
      time: time
    };
    let entries = this.state.entries;
    entries[moment().format('YYYY-MM-DD')].push(newEntry);
    this.setState({
      entries: entries
    });
    this.dataProvider.saveEntry(newEntry);
  }

  getPermission = () => {
    if (typeof Notification === 'undefined') {
      return;
    }
    const app = this;
    Notification.requestPermission().then(function(result) {
        let notificationPermission = result === 'granted';
        app.setState({
          notificationPermission: notificationPermission
        });
    });
  }

  showNotification = () => {
    if (typeof Notification === 'undefined') {
      return;
    }
    if (this.state.notificationPermission) {
      new Notification('Time\'s up!');
      this.audio.play();
    }
  }

  getRandomColor = () => {
    var h = Math.random();
    var rgb = this.HSVtoRGB(h, 0.5, 0.95);
    var r = rgb.r.toString(16);
    if (r.length === 1) r = '0' + r;
    var g = rgb.g.toString(16);
    if (g.length === 1) g = '0' + g;
    var b = rgb.b.toString(16);
    if (b.length === 1) b = '0' + b;
    return '#' + r + g + b;
  }

  HSVtoRGB = (h, s, v) => {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
  }

  render() {
    return (
      <div className="container">
        <Timer onWorkComplete={ this.onWorkComplete } />
        <TaskManager 
          tasks={ this.state.tasks }
          matchingTasks={ this.state.matchingTasks } 
          searchText={ this.state.searchText } 
          handleTaskInput={ this.handleTaskInput } 
          handleDescriptionInput= { this.handleDescriptionInput }
          createTask={ this.createTask }
          selectTask={ this.setSelectedTask } 
          createNewTaskVisible={ this.state.createNewTaskVisible } />
        <Calendar 
          weekOffset={ this.state.weekOffset } 
          entries={ this.state.entries }
          tasks={ this.state.tasks }
          decrementWeek={ this.decrementWeek } 
          incrementWeek={ this.incrementWeek } 
          workDayMinutes={ 480 } 
          workMinutes={ 25 } 
          shortBreakMinutes={ 5 } 
          longBreakMinutes={ 10 } 
          longBreakEvery={ 4 } />
      </div>
    );
  }
}

export default App;