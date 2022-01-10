import React, { Component } from 'react';
import { NavigateFunction } from 'react-router-dom';
import Firebase, { withFirebase } from '../Firebase';
import { withRouter } from '../Navigation';
import * as ROUTES from '../../constants/routes';
import { SignUpLink } from '../SignUp';

function HomePage() {
    return (
        <div>
            <h1>Home</h1>
            <UserStatus />
        </div>
    )
}

interface UserStatusProps {
    firebase: Firebase
}

interface UserStatusState {
    user: any
}

class UserStatusBase extends Component<UserStatusProps, UserStatusState> {
    constructor(props: any) {
        super(props);

        this.state = {user: this.props.firebase.auth.currentUser}
    }

    logoutButton = () => {
        this.props.firebase.doSignOut();
        this.setState({user: this.props.firebase.auth.currentUser})
    }

    render() {
        const user = this.props.firebase.auth.currentUser;

        if(user === null) {
            return(
                <div>
                    <p>Not signed in.</p>
                    <SignUpLink />
                </div>
            )
        } else {
            return(
                <div>
                    <p>Signed in as {user.email}.</p>
                    <button onClick={this.logoutButton}>Log out</button>
                </div>
            )
        }
    }
}

const UserStatus = withFirebase(UserStatusBase)

export default HomePage;