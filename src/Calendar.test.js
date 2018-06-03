import React from 'react';
import {shallow} from 'enzyme';
import Calendar from './Calendar';
import moment from 'moment';

test('Shows table for current week', () => {
    const calendar = shallow(<Calendar workDayMinutes={ 480 } workMinutes={ 25 } shortBreakMinutes={ 5 } entries={ {} }/>);

    let dayHeaders = calendar.find('th.dayHeader');
    expect(dayHeaders.length).toEqual(7);
});

test('Shows rows for entries from 00:30 to 08:00', () => {
    const calendar = shallow(<Calendar workDayMinutes={ 480 } workMinutes={ 25 } shortBreakMinutes={ 5 } entries={ {} } />);

    let rows = calendar.find('tbody > tr');
    expect(rows.length).toEqual(16);
});

test('Shows entry for a day', () => {
    const todaysDate = String(moment().format('YYYY-MM-DD'));
    let entries = {};
    entries[todaysDate] = [{taskName: 'wumbo'}];
    const todaysDayOfWeek = moment().isoWeekday();
    const calendar = shallow(<Calendar workDayMinutes={ 480 } workMinutes={ 25 } shortBreakMinutes={ 5 } weekOffset = { 0 } entries={ entries } />);

    let calendarCell = calendar.find('tbody tr').at(0).find('td').at(todaysDayOfWeek);
    expect(calendarCell.text().indexOf('wumbo') !== -1).toEqual(true);
});