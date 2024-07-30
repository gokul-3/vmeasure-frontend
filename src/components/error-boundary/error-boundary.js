import * as React from "react";
import withRouter from "./with-router";
import { Navigate } from "react-router-dom";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        if (this.state.errorInfo) {
            console.error('Error in front-end : ', error, errorInfo);
        }
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
                <Navigate to={'/'} />
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);