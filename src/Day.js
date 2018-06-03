import React from 'react';

export default class Day extends React.Component {
    render() {
        let date = this.props.date.format('YYYY-MM-DD');
        return <div>{date}</div>;
    }
}