import { User } from "firebase/auth";
import { DocumentData, DocumentSnapshot, Unsubscribe } from "firebase/firestore";
import React, { Component } from "react";
import { EditableField, EditableStat } from ".";
import Firebase, { withFirebase } from "../Firebase";
import { withUser } from "../Session";

interface GameMasterSheetProps {
    firebase: Firebase;
    currentUser: User;
}

interface GameMasterSheetState {
    characters: {[key: string]: any};
}

class GameMasterSheetBase extends Component<GameMasterSheetProps, GameMasterSheetState> {
    characterListListener: Unsubscribe;

    constructor(props: any) {
        super(props);

        this.state = {characters: {}}
        
        const characterListCallbacks = {
            added: (doc: DocumentSnapshot<DocumentData>) => {
                let {characters} = this.state;
                characters[doc.id] = doc.data();
                this.setState({characters: characters});
            },
            removed: (doc: DocumentSnapshot<DocumentData>) => {
                let {characters} = this.state;
                delete characters[doc.id];
                this.setState({characters: characters});
            },
            modified: (doc: DocumentSnapshot<DocumentData>) => {
                let {characters} = this.state;
                characters[doc.id] = doc.data();
                this.setState({characters: characters});
            }
        }
        this.characterListListener = this.props.firebase.addCharactersListener(characterListCallbacks);
    }

    updateValue = (characterId: string, property: string) => (newValue: string) => {
        this.props.firebase.updateCharacterData(
            characterId, 
            property, 
            isNaN(+newValue) ? newValue : +newValue
        );
        if(property === "initiative") {
            this.forceUpdate();
        }
    }

    componentWillUnmount() {
        this.characterListListener();
    }

    render() {
        let characterRows = Object.entries(this.state.characters)
            .sort(function (char1: [string, any], char2: [string, any]){
                return char2[1].initiative - char1[1].initiative;
            })
            .map(([id, character], index) => (
                <tr key={id}>
                    <td>{character.name}</td>
                    <td><EditableStat initialValue={character.initiative} onSubmit={this.updateValue(id, "initiative")} /></td>
                    <td>
                        Total HP: {character.maxHp}
                        <br />
                        Current HP:
                        <EditableStat 
                            initialValue={character.currentHp} 
                            onSubmit={this.updateValue(id, "currentHp")} />
                    </td>
                    <td>
                        Total FP: {character.maxFp}
                        <br />
                        Current FP:
                        <EditableStat 
                            initialValue={character.currentFp} 
                            onSubmit={this.updateValue(id, "currentFp")} />
                    </td>
                    <td>
                        <EditableField
                            initialValue={character.statuses}
                            onSubmit={this.updateValue(id, "statuses")} />
                    </td>
                    <td>
                        <EditableField
                            initialValue={character.cooldowns}
                            onSubmit={this.updateValue(id, "cooldowns")} />
                    </td>
                </tr>
            ));

        return (
            <div>
                <h2>Game Master sheet</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Character</th>
                            <th>Initiative</th>
                            <th>HP</th>
                            <th>FP</th>
                            <th>Statuses</th>
                            <th>Cooldowns</th>
                        </tr>
                    </thead>
                    <tbody>
                        {characterRows}
                    </tbody>
                </table>
            </div>
        )
    }
}

const GameMasterSheet = withUser(withFirebase(GameMasterSheetBase));

export default GameMasterSheet;