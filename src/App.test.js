import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {mount} from 'enzyme';
import MemoryDataProvider from './memoryDataProvider';
import moment from 'moment';

jest.useFakeTimers();

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App dataProvider={new MemoryDataProvider()}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('Shows "No task" option selected by default', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);

  let tasks = app.find('.task');
  expect(tasks.length).toEqual(1);

  let task = tasks.first();
  expect(task.text()).toEqual('No task');
  expect(task.hasClass('selected')).toBeTruthy();
});

test('Shows button to create a new task after something is typed into task search box', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);

  expect(app.find('#createNewTask').length).toEqual(0);

  let searchBox = app.find('#taskInput').first();
  searchBox.simulate('input', { target: { value: 'wumbo' } });

  let createNewBtn = app.find('#createNewTask');

  expect(createNewBtn.text()).toEqual('Create new task "wumbo"');
});

test('Creates a new task after clicking on Create new task button', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);

  let searchBox = app.find('#taskInput').first();
  searchBox.simulate('input', { target: { value: 'wumbo' } });

  expect(app.find('#taskInput').instance().value).toEqual('wumbo');

  app.find('#createNewTask').simulate('click');

  let tasks = app.find('.task');
  expect(tasks.length).toEqual(2);

  expect(tasks.at(1).text()).toEqual('wumbo');

  expect(app.find('#createNewTask').length).toEqual(0);

  expect(app.find('#taskInput').instance().value).toEqual('');
});

test('Selects task when clicked', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);

  createTask(app, 'wumbo');
  createTask(app, 'Finland');

  app.find('.task').at(2).simulate('click');

  expect(app.find('.task').at(2).hasClass('selected')).toBeTruthy();
});

test('Finds tasks on partial match', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);

  let tasksThatShouldBeFound = [
    'seabearstart',
    'middleseabearmiddle',
    'endseabear',
    'a seabear that is very big',
    'DifferentCaseSeaBear'
  ];

  tasksThatShouldBeFound.forEach(task => {
    createTask(app, task);
  });

  createTask(app, 'Squidward');

  app.find('#taskInput').first().simulate('input', { target: { value: 'seabear' } });

  let tasks = app.find('.task');

  expect(tasks.length).toEqual(6);
  expect(tasks.at(0).text()).toBe('No task');
  tasks.forEach(task => {
    expect(tasksThatShouldBeFound.indexOf(task.text() !== -1)).toBeTruthy();
  });

  expect(app.find('#createNewTask').length).toEqual(1);
});

test('Finds task on perfect match', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);

  let perfectMatch = 'seabear';
  let partialMatches = [
    'seabearstart',
    'middleseabearmiddle',
    'endseabear',
    'a seabear that is very big',
    'DifferentCaseSeaBear'
  ];
  let noMatches = [
    'Squidward',
    'Tennisballs'
  ];

  partialMatches.forEach(task => {
    createTask(app, task);
  });
  createTask(app, noMatches[0]);
  createTask(app, perfectMatch);
  createTask(app, noMatches[1]);

  app.find('#taskInput').first().simulate('input', { target: { value: 'seabear' } });

  let tasks = app.find('.task');

  expect(tasks.length).toEqual(7);
  expect(tasks.at(0).text()).toEqual('No task');
  expect(tasks.at(1).text()).toEqual('seabear');
  tasks.forEach(task => {
    expect(partialMatches.indexOf(task.text() !== -1)).toBeTruthy();
  });

  expect(app.find('#createNewTask').length).toEqual(0);
});

test('After 25 minutes timer finishes, saves current task in calendar', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);

  createTask(app, 'wumbo');

  app.find('#startWork').simulate('click');

  jest.runTimersToTime(1500000);
  app.update();

  let currentTime = moment().format('HH:mm');
  let minuteEarlier = moment().add(-1, 'minutes').format('HH:mm'); // in case minute changed since task was saved

  let today = moment().isoWeekday();

  let calendarCell = app.find('tbody tr').at(0).find('td').at(today);
  expect(calendarCell.text().indexOf('wumbo') !== -1).toEqual(true);
  expect(calendarCell.text().indexOf(currentTime) !== -1 || calendarCell.text().indexOf(minuteEarlier) !== -1).toEqual(true);
});

test('Shows tasks for shown week', () => {
  let memoryProvider = new MemoryDataProvider();
  let weekAgo = moment().subtract(1, 'weeks');
  let entry = {
    taskName: 'wumbo',
    date: weekAgo.format('YYYY-MM-DD'),
    time: '09:00'
  };
  memoryProvider.entries[weekAgo.format('YYYY-MM-DD')] = [entry];

  const app = mount(<App dataProvider={ memoryProvider }/>);
  createTask(app, 'wumbo');

  app.find('#previousWeek').simulate('click');

  let calendarCell = app.find('tbody tr').at(0).find('td').at(weekAgo.isoWeekday());
  expect(calendarCell.text().indexOf('wumbo') !== -1).toBe(true);
});

test('Generates random color for new task', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);
  createTask(app, 'wumbo');
  createTask(app, 'TV');

  let tasks = app.find('.task');
  expect(tasks.at(1).prop('style')).toHaveProperty('backgroundColor');
  expect(tasks.at(2).prop('style')).toHaveProperty('backgroundColor');
  expect(tasks.at(1).prop('style').backgroundColor).not.toBe(tasks.at(2).prop('style').backgroundColor);
});

test('Marks entry with task color', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);

  createTask(app, 'wumbo');

  app.find('#startWork').simulate('click');

  jest.runTimersToTime(1500000);
  app.update();

  let today = moment().isoWeekday();

  let calendarCell = app.find('tbody tr').at(0).find('td').at(today);
  let taskColor = app.find('.task').at(1).prop('style').backgroundColor;
  let cellColor = calendarCell.prop('style').backgroundColor;

  expect(cellColor).toBe(taskColor);
});

test('Don\'t display task description field if creating new task is not possible', () => {
  const app = mount(<App dataProvider={new MemoryDataProvider()}/>);
  
  expect(app.find('#taskDescription').length).toEqual(0);

  createTask(app, 'wumbo');

  app.find('#taskInput').first().simulate('input', { target: { value: 'wum' } }); // on partial match, creating new task is possible
  expect(app.find('#taskDescription').length).toEqual(1);

  app.find('#taskInput').first().simulate('input', { target: { value: 'wumbo' } }); // on perfect match, creating new task is not possible
  expect(app.find('#taskDescription').length).toEqual(0);
});

test('Create task with provided description', () => {
  const dataProvider = new MemoryDataProvider();
  const app = mount(<App dataProvider={ dataProvider } />);

  app.find('#taskInput').first().simulate('input', { target: { value: 'wumbo' } });
  app.find('#taskDescription').first().simulate('input', { target: { value: 'what Wumbology is about' } });
  app.find('#createNewTask').simulate('click');

  expect(app.find('.task').at(1).prop('title')).toEqual('what Wumbology is about');

  // check if description is displayed on task's entries
  app.find('#startWork').simulate('click');

  jest.runTimersToTime(1500000);
  app.update();

  let today = moment().isoWeekday();

  let calendarCell = app.find('tbody tr').at(0).find('td').at(today);
  expect(calendarCell.prop('title')).toEqual('what Wumbology is about');
});

test('Display task\'s description on entry', () => {
  const dataProvider = new MemoryDataProvider();
  const app = mount(<App dataProvider={ dataProvider } />);

  app.find('#taskInput').first().simulate('input', { target: { value: 'wumbo' } });
  app.find('#taskDescription').first().simulate('input', { target: { value: 'what Wumbology is about' } });
  app.find('#createNewTask').simulate('click');

  app.find('#startWork').simulate('click');

  jest.runTimersToTime(1500000);
  app.update();

  let today = moment().isoWeekday();

  let calendarCell = app.find('tbody tr').at(0).find('td').at(today);
  expect(calendarCell.prop('title')).toEqual('what Wumbology is about');
});

function createTask(app, taskName) {
  app.find('#taskInput').first().simulate('input', { target: { value: taskName } });
  app.find('#createNewTask').simulate('click');
}