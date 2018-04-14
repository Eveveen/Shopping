import React, { Component } from 'react';
import { UiAlert } from 'liveramp-ui-toolkit';

class Alert extends Component {
    state = {
        timeToClose: new Date().getTime() + 3000
    }
    componentDidMount() {
        const intervalId = setInterval(() => {
            if (new Date().getTime() > this.state.timeToClose) {
                this.removeAlert();
            }
        }, 1000);
        this.intervalId = intervalId;
    }

    removeAlert = () => {
        this.props.removeAlert();
    }

    componentWillReceiveProps() {
        this.setState({ timeToClose: new Date().getTime() + 3000 });
    }

    componentWillUnmount() {
        if (Number.isInteger(this.intervalId)) {
            clearInterval(this.intervalId);
        }
    }
    render() {
        const { type, message, handleClose } = this.props;
        return (
            <div>
                <UiAlert
                    type={type}
                    message={message}
                    handleClose={handleClose}
                />
            </div>
        );
    }
}

export default Alert;