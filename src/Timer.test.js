import React from 'react';
import {shallow} from 'enzyme';
import Timer from './Timer';

jest.useFakeTimers();

test('Timer displays formatted time', () => {
    const timer = shallow(<Timer onWorkComplete={ () => {} } />);

    expect(timer.find('#timer').text()).toEqual('25:00');
});

test('Starts the timer after clicking on Start Work button', () => {
    const timer = shallow(<Timer onWorkComplete={ () => {} } />); 

    timer.find('#startWork').simulate('click');

    expect(timer.find('#timer').text()).toEqual('25:00');

    jest.runTimersToTime(1000);

    timer.update();

    expect(timer.find('#timer').text()).toEqual('24:59');
});

test('Stops the timer after running to zero', () => {
    const timer = shallow(<Timer onWorkComplete={ () => {} } />); 
    timer.find('#startWork').simulate('click');

    jest.runTimersToTime(1500000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('00:00');

    jest.runTimersToTime(1000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('00:00');
});

test('Calls work callback after work finishes', () => {
    const workCallback = jest.fn();
    const timer = shallow(<Timer onWorkComplete={ workCallback } />); 
    timer.find('#startWork').simulate('click');

    jest.runTimersToTime(1500000);
    timer.update();

    expect(workCallback).toHaveBeenCalledTimes(1);
});

test('Doesn\'t call work callback after break finishes', () => {
    const workCallback = jest.fn();
    const timer = shallow(<Timer onWorkComplete={ workCallback } />); 
    timer.find('#startShortBreak').simulate('click');

    jest.runTimersToTime(300000);
    timer.update();

    expect(workCallback).toHaveBeenCalledTimes(0);
});

test('Pauses the timer after clicking Play/Pause when timer is running', () => {
    const timer = shallow(<Timer onWorkComplete={ () => {} } />); 
    timer.find('#startWork').simulate('click');

    jest.runTimersToTime(683000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('13:37');

    timer.find('#playPause').simulate('click');

    jest.runTimersToTime(2000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('13:37');

    timer.find('#playPause').simulate('click');

    jest.runTimersToTime(1000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('13:36');
});

test('Sets the timer to 5 min and starts it when clicking on Short Break', () => {
    const timer = shallow(<Timer onWorkComplete={ () => {} } />); 

    timer.find('#startShortBreak').simulate('click');

    expect(timer.find('#timer').text()).toEqual('05:00');

    jest.runTimersToTime(1000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('04:59');

    jest.runTimersToTime(300000); // full five minutes, to see if it stops on 00:00
    timer.update();

    expect(timer.find('#timer').text()).toEqual('00:00');
});

test('Sets the timer to 10 min and starts it when clicking on Long Break', () => {
    const timer = shallow(<Timer onWorkComplete={ () => {} } />); 

    timer.find('#startLongBreak').simulate('click');

    expect(timer.find('#timer').text()).toEqual('10:00');

    jest.runTimersToTime(1000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('09:59');

    jest.runTimersToTime(600000); // full ten minutes, to see if it stopped on 00:00
    timer.update();

    expect(timer.find('#timer').text()).toEqual('00:00');
});

test('Sets timer value correctly when Start Work is clicked when the timer is already running', () => {
    const timer = shallow(<Timer onWorkComplete={ () => {} } />); 

    timer.find('#startShortBreak').simulate('click');

    jest.runTimersToTime(10000);
    timer.update();

    timer.find('#startWork').simulate('click');

    expect(timer.find('#timer').text()).toEqual('25:00');
});

test('Clears previous interval when new one is set', () => {
    const timer = shallow(<Timer onWorkComplete={ () => {} } />); 

    timer.find('#startWork').simulate('click');
    timer.find('#startShortBreak').simulate('click');

    jest.runTimersToTime(1000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('04:59');
});

test('Fast forwards timer after clicking on button', () => {
    let workCallback = jest.fn();
    const timer = shallow(<Timer onWorkComplete={ workCallback } />); 

    timer.find('#startWork').simulate('click');
    timer.find('#fastForward').simulate('click');

    expect(timer.find('#timer').text()).toEqual('00:00');
    expect(workCallback).toHaveBeenCalledTimes(1);
});

test('After timer is finished, clicking on Play starts new work', () => {
    const timer = shallow(<Timer onWorkComplete={ () => {} } />); 
    timer.find('#startWork').simulate('click');

    jest.runTimersToTime(1500000);
    timer.update();
    timer.find('#playPause').simulate('click');

    expect(timer.find('#timer').text()).toEqual('25:00');

    jest.runTimersToTime(1000);
    timer.update();
    expect(timer.find('#timer').text()).toEqual('24:59');
});