import { User } from "firebase/auth";
import React, { Component, useContext } from "react";
import Firebase, { FirebaseContext, withFirebase } from "../Firebase";
import { AuthUserContext, withUser, withUserContext } from "../Session";

const AccountPage = () => (
    <div>
        <h1>Account</h1>
        <AccountDetails />
    </div>
)

interface AccountDetailsProps {
    firebase: Firebase | null;
    currentUser: User | null;
}

interface AccountDetailsState {
    username: string | null;
    character: string | null;
}

class AccountDetailsBase extends Component<AccountDetailsProps, AccountDetailsState> {
    //currentUser: User | null;
    constructor(props: any) {
        super(props);

        this.state = {username: null, character: null}
        //this.currentUser = this.props.userContext(AuthUserContext);
    }

    componentDidMount() {
        this.findUserDetails();
    }

    findUserDetails = () => {
        // TODO: There is some issue here where the currentUser is initially read as null and later gets updated
        // with the proper value, but this component doesn't get re-rendered. The "Try Again" button is a temp
        // solution to get it working until I figure out a fix.
        if(!this.props.currentUser) {
            console.log("User is null")
            return;
        }
        this.props.firebase!.getUserData(this.props.currentUser.uid)
            .then(userDetails => {
                if (userDetails) {
                    this.setState({username: userDetails.username, character: userDetails.character})
                }
            })
            .catch(error => console.log(error));
    }

    render() {
        if(!this.props.currentUser) {
            return <p>Not signed in.</p>
        }
        if (this.state.username) {
            return (
                <div>
                    <p><strong>Email:</strong> {this.props.currentUser.email}</p>
                    <p><strong>Username:</strong> {this.state.username}</p>
                    <p><strong>Character:</strong> {this.state.character ? this.state.character : <i>Not chosen</i>}</p>
                </div>
            )
        } else {
            return (
                <div>
                    <p>Missing some user details. Please try again or delete and re-create your account.</p>
                    <button onClick={this.findUserDetails}>Try again</button>
                </div>
            )
        }
    }
}

// const AccountDetails = () => (
//     <div>
//         <AuthUserContext.Consumer>
//             {currentUser => <FirebaseContext.Consumer>
//                 {firebase => <AccountDetailsBase currentUser={currentUser} firebase={firebase}/>}
//             </FirebaseContext.Consumer>}
//         </AuthUserContext.Consumer>
//     </div>
// ) 
const AccountDetails = withUser(withFirebase(AccountDetailsBase))

export default AccountPage;

export { AccountDetails }