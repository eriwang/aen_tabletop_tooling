import React, { Component } from 'react';
import Firebase, { withFirebase } from '../Firebase';
import { SignUpLink } from '../SignUp';
import { SignInLink } from '../SignIn';
import { User } from 'firebase/auth';
import { withUser } from '../Session';

function HomePage() {
    return (
        <div>
            <h1>Home</h1>
            <UserStatus />
        </div>
    )
}

interface UserStatusProps {
    firebase: Firebase;
    currentUser: User;
}

interface UserStatusState {
    username: string;
}

class UserStatusBase extends Component<UserStatusProps, UserStatusState> {
    constructor(props: any) {
        super(props);

        this.state = {username: ""};
        this.getUsername();
    }

    componentDidUpdate = (prevProps: UserStatusProps) => {
        if(this.props.currentUser !== prevProps.currentUser) {
            this.getUsername();
        }
    }

    getUsername = () => {
        const {currentUser} = this.props;
        if(currentUser) {
            this.props.firebase.getUserData(currentUser.uid)
                .then(data => {
                    this.setState({username: data!.username});
                })
                .catch(error => console.error(error));
        } else {
            this.setState({username: ""});
        }
    }

    logoutButton = () => {
        this.props.firebase.doSignOut()
        .catch((error: any) => {
            console.log(error);
        });
    }

    render() {
        if(this.props.currentUser === null) {
            return(
                <div>
                    <p>Not signed in.</p>
                    <SignInLink />
                    <SignUpLink />
                </div>
            )
        } else {
            return(
                <div>
                    <p>Signed in as {this.state.username}.</p>
                    <button onClick={this.logoutButton}>Log out</button>
                </div>
            )
        }
    }
}

const UserStatus = withUser(withFirebase(UserStatusBase))

export default HomePage;