import { User } from "firebase/auth";
import { DocumentData, DocumentSnapshot, Unsubscribe } from "firebase/firestore";
import React, { Component } from "react";
import { Attributes, EditableStat, Weapons } from ".";
import Firebase, { withFirebase } from "../Firebase";
import { withUser } from "../Session";

const DashboardPage = () => (
    <div>
        <h1>Dashboard</h1>
        <CharacterSheet />
    </div>
)

interface CharacterSheetProps {
    firebase: Firebase;
    currentUser: User;
}

interface CharacterSheetState {
    characterDetails: any | null;
    characterId: string | null;
    charactersList: Map<string, string>;
}

class CharacterSheetBase extends Component<CharacterSheetProps, CharacterSheetState> {
    characterListener: Unsubscribe | null;
    characterListListener: Unsubscribe | null;

    constructor(props: any) {
        super(props);

        this.state = {characterDetails: null, characterId: null, charactersList: new Map()};
        this.characterListener = null;
        const characterListCallbacks = new Map();
        characterListCallbacks.set("added", (doc: DocumentSnapshot<DocumentData>) => {
            let {charactersList} = this.state;
            const newCharacterDetails = doc.data();
            charactersList.set(doc.id, newCharacterDetails!.name);
            this.setState({charactersList: charactersList});
        });
        characterListCallbacks.set("removed", (doc: DocumentSnapshot<DocumentData>) => {
            let {charactersList} = this.state;
            charactersList.delete(doc.id);
            this.setState({charactersList: charactersList});
        });
        this.characterListListener = this.props.firebase.addCharactersListener(characterListCallbacks);
    }

    componentDidMount() {
        this.findCharacterDetails();
    }

    componentWillUnmount() {
        if(this.characterListener) {
            this.characterListener();
        }
        if(this.characterListListener) {
            this.characterListListener();
        }
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
                    if(this.characterListener) {
                        this.characterListener();
                    }
                    this.characterListener = this.props.firebase?.addCharacterListener(
                        userDetails?.character, 
                        doc => {this.setState({characterDetails: doc.data()}); console.log(this.state.characterDetails)}
                    );
                    this.setState({characterId: userDetails.character})
                }
            })
            .catch(error => console.log(error));
    }

    render() {
        console.log("Character Id: " + this.state.characterId);
        return (
            <div>
                <h2>Character sheet for {this.state.characterDetails?.name}</h2>
                <Attributes attributes={this.state.characterDetails?.attributeToStat} />
                {this.state.characterDetails && <EditableStat character={this.state.characterId} statName="currentHp" prettyName="Current HP" initialValue={this.state.characterDetails?.currentHp} />}
                {this.state.characterDetails && this.state.characterId && <Weapons weaponList={this.state.characterDetails.weapons} characterId={this.state.characterId} charactersList={this.state.charactersList} />}
                <button onClick={this.findCharacterDetails}>Refresh</button>
            </div>
        )
    }
}

const CharacterSheet = withUser(withFirebase(CharacterSheetBase));

export default DashboardPage;