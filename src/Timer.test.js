import React from 'react';
import {shallow} from 'enzyme';
import Timer from './Timer';

jest.useFakeTimers();

test('Timer displays formatted time', () => {
    const timer = shallow(<Timer />);

    expect(timer.find('#timer').text()).toEqual('25:00');
});

test('Starts the timer after clicking on Start Work button', () => {
    const timer = shallow(<Timer />); 

    timer.find('#startWork').simulate('click');

    expect(timer.find('#timer').text()).toEqual('25:00');

    jest.runTimersToTime(1000);

    timer.update();

    expect(timer.find('#timer').text()).toEqual('24:59');
});

test('Stops the timer after running to zero', () => {
    const timer = shallow(<Timer />); 
    timer.find('#startWork').simulate('click');

    jest.runTimersToTime(1500000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('00:00');

    jest.runTimersToTime(1000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('00:00');
});

test('Pauses the timer after clicking Play/Pause when timer is running', () => {
    const timer = shallow(<Timer />); 
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
    const timer = shallow(<Timer />); 

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
    const timer = shallow(<Timer />); 

    timer.find('#startLongBreak').simulate('click');

    expect(timer.find('#timer').text()).toEqual('10:00');

    jest.runTimersToTime(1000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('09:59');

    jest.runTimersToTime(600000); // full ten minutes, to see if it stops on 00:00
    timer.update();

    expect(timer.find('#timer').text()).toEqual('00:00');
});

test('Sets timer value correctly when Start Work is clicked when the timer is already running', () => {
    const timer = shallow(<Timer />); 

    timer.find('#startShortBreak').simulate('click');

    jest.runTimersToTime(10000);
    timer.update();

    timer.find('#startWork').simulate('click');

    expect(timer.find('#timer').text()).toEqual('25:00');
});

test('Clears previous interval when new one is set', () => {
    const timer = shallow(<Timer />); 

    timer.find('#startWork').simulate('click');
    timer.find('#startShortBreak').simulate('click');

    jest.runTimersToTime(1000);
    timer.update();

    expect(timer.find('#timer').text()).toEqual('04:59');
});