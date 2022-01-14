import { User } from "firebase/auth";
import { Unsubscribe } from "firebase/firestore";
import React, { Component } from "react";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { Attributes, EditableStat } from ".";
import Firebase, { withFirebase } from "../Firebase";
import { withUser } from "../Session";

const DashboardPage = () => (
    <div>
        <h1>Dashboard</h1>
        <CharacterSheet />
    </div>
)

interface CharacterSheetProps {
    firebase: Firebase | null;
    currentUser: User | null;
}

interface CharacterSheetState {
    characterListener: Unsubscribe | null;
    characterDetails: any | null;
    characterId: string | null;
}

class CharacterSheetBase extends Component<CharacterSheetProps, CharacterSheetState> {
    constructor(props: any) {
        super(props);

        this.state = {characterListener: null, characterDetails: null, characterId: null};
    }

    componentDidMount() {
        this.findCharacterDetails();
    }

    componentWillUnmount() {
        this.state.characterListener!();
    }

    findCharacterDetails = () => {
        if(!this.props.currentUser) {
            console.log("User is null")
            return;
        }
        console.log("User is not null");
        this.props.firebase?.getUserData(this.props.currentUser?.uid)
            .then(userDetails => {
                if(userDetails) {
                    const unsub = this.props.firebase?.addCharacterListener(
                        userDetails?.character, 
                        doc => {this.setState({characterDetails: doc.data()}); console.log(this.state.characterDetails)}
                    );
                    if(unsub !== undefined) {
                        console.log("Listener attached");
                        this.setState({characterListener: unsub, characterId: userDetails?.character});
                    }

                    // this.props.firebase?.getCharacterData(userDetails?.character)
                    //     .then(characterDetails => this.setState({characterDetails: characterDetails}))
                    //     .catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <div>
                <h2>Character sheet for {this.state.characterDetails?.name}</h2>
                <Attributes attributes={this.state.characterDetails?.attributeToStat} />
                {this.state.characterDetails && <EditableStat character={this.state.characterId} statName="currentHp" prettyName="Current HP" initialValue={this.state.characterDetails?.currentHp} />}
                <button onClick={this.findCharacterDetails}>Refresh</button>
            </div>
        )
    }
}

const CharacterSheet = withUser(withFirebase(CharacterSheetBase));

export default DashboardPage;