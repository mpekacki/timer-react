import React from 'react';
import moment from 'moment';

export default class Calendar extends React.Component {
    decrementWeek = () => {
        this.props.decrementWeek();
    }

    incrementWeek = () => {
        this.props.incrementWeek();
    }

    render() {
        let weekStart = moment().startOf('isoWeek').add(this.props.weekOffset, 'weeks');

        let minutesPerRow = this.props.workMinutes + this.props.shortBreakMinutes;
        let numOfRows = Math.ceil(this.props.workDayMinutes / (minutesPerRow));

        let tasksMap = {};
        if (this.props.tasks) {
            this.props.tasks.forEach(task => {
                tasksMap[task.name] = task;
            });
        }

        let getEntryStyle = (taskName) => {
            if (taskName in tasksMap && tasksMap[taskName].color) {
                return {
                    backgroundColor: tasksMap[taskName].color 
                };
            } else {
                return {};
            }
        }

        let getEntryDescription = (taskName) => {
            if (taskName in tasksMap && tasksMap[taskName].description) {
                return tasksMap[taskName].description;
            } else {
                return '';
            }
        }

        let rowTime = moment().startOf('day');
        return (
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>
                            <button id="previousWeek" className="btn" onClick={ this.decrementWeek }>&lt;</button>
                        </th>
                        {[...Array(7).keys()].map(i => {
                            let date = weekStart.clone().add(i, 'days');
                            return (
                                <th className="dayHeader" key={i}>
                                    {date.format('dddd')}
                                    <br/>
                                    {date.format('YYYY-MM-DD')}
                                </th>
                            )
                        })}
                        <th>
                            <button id="nextWeek" className="btn" onClick={ this.incrementWeek }>&gt;</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(numOfRows).keys()].map(i => {
                        rowTime.add(minutesPerRow, 'minutes');
                        return (
                            <tr key={i}>
                                <td>
                                    {rowTime.format('HH:mm')}
                                </td>
                                {[...Array(7).keys()].map(j => {
                                    return ((dayEntries) => { 
                                        return (dayEntries && dayEntries.length >= i + 1) ? <td key={j} style={getEntryStyle(dayEntries[i].taskName) } title={getEntryDescription(dayEntries[i].taskName)}>{dayEntries[i].time}<span className="ml-2">{dayEntries[i].taskName}</span></td> : <td key={j}></td>
                                    })(this.props.entries[weekStart.clone().add(j, 'days').format('YYYY-MM-DD')])
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }
}