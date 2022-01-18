import { User } from "firebase/auth";
import React, { ChangeEvent, Component, FormEvent } from "react";
import CharacterSelector from "../CharacterSelector";
import Firebase, { withFirebase } from "../Firebase";
import { withUser } from "../Session";

const AccountPage = () => (
    <div>
        <h1>Account</h1>
        <AccountDetails />
    </div>
)

interface AccountDetailsProps {
    firebase: Firebase;
    currentUser: User;
}

interface AccountDetailsState {
    username: string;
    character: string;
    characterList: { [key: string]: string };
}

class AccountDetailsBase extends Component<AccountDetailsProps, AccountDetailsState> {
    //currentUser: User | null;
    constructor(props: any) {
        super(props);

        this.state = {username: "", character: "", characterList: {}}
        //this.currentUser = this.props.userContext(AuthUserContext);
    }

    componentDidMount() {
        this.findUserDetails();
    }

    componentDidUpdate = (prevProps: AccountDetailsProps) => {
        if(this.props.currentUser !== prevProps.currentUser) {
            this.findUserDetails();
        }
    }

    updateUserDetail = (property: string) => (newValue: any) => {
        this.props.firebase.updateUserData(this.props.currentUser.uid, {[property]: newValue})
            .then(() => {
                console.log("Updated character " + property + " to ", newValue);
            })
            .catch(error => {
                console.error(error);
            })
    }

    findUserDetails = () => {
        if(!this.props.currentUser) {
            //console.log("User is null")
            return;
        }
        //console.log("User is not null");
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
        return (
            <div>
                <p><strong>Email:</strong> {this.props.currentUser.email}</p>
                <p><strong>Username:</strong></p>
                <form onSubmit={event => {this.updateUserDetail("username")(this.state.username); event.preventDefault();}}>
                    <input name="username" value={this.state.username} onChange={event => this.setState({username: event.target.value})} type="text" />
                    <button type="submit">Update</button>
                </form>
                <p><strong>Character:</strong></p>
                <CharacterSelector 
                    initialValue={this.state.character}
                    onChange={this.updateUserDetail("character")} />
            </div>
        )
    }
}

const AccountDetails = withUser(withFirebase(AccountDetailsBase))

export default AccountPage;

export { AccountDetails }