import React from 'react';
import Firebase, { withFirebase } from '../Firebase';

const AuthUserContext = React.createContext(null);

export const withAuthentication = (Component: React.ComponentType<any>) => {
    interface AuthProps {
        firebase: Firebase
    }

    interface AuthState {
        currentUser: any
    }

    class WithAuthentication extends React.Component<AuthProps, AuthState> {
        listener: any;

        constructor(props: any) {
            super(props);

            this.listener = null;
            this.state = {
                currentUser: null
            }
        }

        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    authUser ? this.setState({ currentUser: authUser })
                    : this.setState({ currentUser: null });
                    console.log(authUser)
                }
            )
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value = {this.state.currentUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            )
        }
    }

    return withFirebase(WithAuthentication)
}

export default AuthUserContext;