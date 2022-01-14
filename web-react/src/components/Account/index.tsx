import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import React, { ChangeEvent, Component, useContext, FormEvent } from "react";
import Firebase, { FirebaseContext, withFirebase } from "../Firebase";
import { AuthUserContext, withUser } from "../Session";

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
        console.log("User is not null");
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
                    <CharacterSelection chosenCharacter={this.state.character} />
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

interface CharacterSelectionProps {
    firebase: Firebase | null;
    currentUser: User | null;
    chosenCharacter: string | null;
}

interface CharacterSelectionState {
    character: string;
    error: any;
    characterList: { [key: string]: string };
}

class CharacterSelectionBase extends Component<CharacterSelectionProps, CharacterSelectionState> {
    constructor(props: any) {
        super(props);

        this.state = {
            character: this.props.chosenCharacter ? this.props.chosenCharacter : "",
            characterList: {},
            error: null
        }

        this.getCharacterList();
    }

    getCharacterList = () => {
        this.props.firebase!.getCharactersData()
            .then(snapshot => {
                let characterList: { [key: string]: string } = {};
                snapshot?.forEach((doc) => {
                    const data = doc.data();
                    characterList[doc.id] = data['name'];
                });
                this.setState({ characterList: characterList });
            })
            .catch(error => {
                this.setState({ error: error });
            });
    }

    onChange = (event: ChangeEvent) => {
        const target = event.target as HTMLSelectElement;
        const newState = { [target.name]: target.value } as any as Pick<CharacterSelectionState, keyof CharacterSelectionState>;
        this.setState(newState);
    }

    onSubmit = (event: FormEvent) => {
        const { character } = this.state;

        this.props.firebase?.updateUserData(this.props.currentUser?.uid, {character: character})
            .then(() => {
                console.log("Set character successfully");
            })
            .catch(error => {
                this.setState({error: error})
            })
        //console.log("Selected " + this.state.character)

        event.preventDefault();
    };

    render() {
        const {character, error} = this.state;

        let characterOptions = Object.entries(this.state.characterList)
            .map(([id, name]) => <option value={id} key={id}>{name}</option>);

        return(
            <div>
                <p><strong>Character:</strong></p>
                <form onSubmit={this.onSubmit}>
                    <select name="character" value={character} placeholder="Character" onChange={this.onChange}>
                        <option value={""} key="Not selected"></option>
                        {characterOptions}
                    </select>
                    <button type="submit">Select</button>
                </form>
                {error && <p>{error.message}</p>}
            </div>
        )
    }
}

const CharacterSelection = withUser(withFirebase(CharacterSelectionBase))

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

export { AccountDetails, CharacterSelection }