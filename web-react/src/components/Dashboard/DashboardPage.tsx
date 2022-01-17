import { User } from "firebase/auth";
import { DocumentData, DocumentSnapshot, Unsubscribe } from "firebase/firestore";
import React, { Component } from "react";
import { Abilities, Armors, Attributes, BasicStats, Defenses, EditableField, Skills, Weapons } from ".";
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

    updateValue = (property: string) => (newValue: string) => {
        this.props.firebase.updateCharacterData(
            this.state.characterId!, 
            property, 
            isNaN(+newValue) ? newValue : +newValue
        );
    }

    render() {
        console.log("Character Id: " + this.state.characterId);
        return (
            <div>
                <h2>Character sheet for {this.state.characterDetails?.name}</h2>
                <h3>{this.state.characterDetails?.race} {this.state.characterDetails?.class}</h3>
                <button onClick={this.findCharacterDetails}>Refresh</button>
                <hr />
                <div className="charSheet">
                    <Attributes attributes={this.state.characterDetails?.attributes} />
                    <BasicStats 
                        characterDetails={this.state.characterDetails} 
                        onInitiativeChange={this.updateValue("initiative")}
                        onHpChange={this.updateValue("currentHp")}
                        onFpChange={this.updateValue("currentFp")}/>
                    {
                        this.state.characterDetails && 
                        this.state.characterId && 
                        <Weapons 
                            weaponList={this.state.characterDetails.weapons} 
                            characterId={this.state.characterId} 
                            charactersList={this.state.charactersList} />
                    }
                    {
                        this.state.characterDetails && 
                        this.state.characterId && 
                        <Abilities 
                            abilityList={this.state.characterDetails.abilities} 
                            characterId={this.state.characterId} 
                            charactersList={this.state.charactersList} />
                    }
                    {
                        this.state.characterDetails &&
                        <div>
                        <div>
                            <p><strong>Cooldowns</strong></p>
                            <EditableField 
                                initialValue={this.state.characterDetails.cooldowns} 
                                onSubmit={this.updateValue("cooldowns")} />
                        </div>
                        <div>
                            <p><strong>Statuses</strong></p>
                            <EditableField 
                                initialValue={this.state.characterDetails.statuses} 
                                onSubmit={this.updateValue("statuses")} />
                        </div>
                        </div>
                    }
                    {
                        this.state.characterDetails &&
                        <Armors 
                            armorName={this.state.characterDetails.armor} 
                            resistances={this.state.characterDetails.resistanceToFlat} />
                    }
                    {
                        this.state.characterDetails &&
                        <Defenses 
                            attributes={this.state.characterDetails.attributes} />
                    }
                    {
                        this.state.characterDetails &&
                        <Skills 
                            skills={this.state.characterDetails.skills} />
                    }
                </div>
            </div>
        )
    }
}

const CharacterSheet = withUser(withFirebase(CharacterSheetBase));

export default DashboardPage;