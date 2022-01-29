import { User } from "firebase/auth";
import { Component } from "react";
import { CharacterSheet, GameMasterSheet } from ".";
import Firebase, { withFirebase } from "../Firebase";
import { withUser } from "../Session";

interface DashboardProps {
    firebase: Firebase;
    currentUser: User;
}

interface DashboardState {
    characterId: string;
    isGameMaster: boolean;
}

class DashboardPageBase extends Component<DashboardProps, DashboardState> {
    constructor(props: any) {
        super(props);

        this.state = {isGameMaster: false, characterId: ""};
        this.getUserCharacter();
    }

    componentDidUpdate = (prevProps: DashboardProps) => {
        if(this.props.currentUser !== prevProps.currentUser) {
            this.getUserCharacter();
        }
    }

    getUserCharacter = () => {
        if(!this.props.currentUser) {
            console.warn("User is null - do you need to sign in?");
            return;
        }
        this.props.firebase.getUserData(this.props.currentUser.uid)
            .then(userDetails => {
                if(userDetails) {
                    this.setState({characterId: userDetails.character});
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    switchView = () => {
        this.setState({isGameMaster: !this.state.isGameMaster});
    }

    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <button onClick={this.switchView}>Switch view</button>
                {
                    this.state.isGameMaster 
                        ? <GameMasterSheet /> 
                        : (
                            this.state.characterId === "" 
                            ?   <div>
                                    <p>Unable to load character data. Please try again.</p>
                                    <button onClick={this.getUserCharacter}>Try again</button>
                                    <p>Other troubleshooting options:</p>
                                    <ul>
                                        <li>You may not be signed in.</li>
                                        <li>You may not have selected a character in the Account settings.</li>
                                    </ul>
                                </div>
                            : <CharacterSheet characterId={this.state.characterId}/>
                        )
                }
            </div>
        )
    }
}

const DashboardPage = withUser(withFirebase(DashboardPageBase))

export default DashboardPage;