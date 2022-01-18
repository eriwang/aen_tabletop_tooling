import { User } from "firebase/auth";
import { Unsubscribe } from "firebase/firestore";
import React, { Component } from "react";
import { Abilities, Armors, Attributes, BasicStats, Defenses, EditableField, Skills, Weapons } from ".";
import Firebase, { withFirebase } from "../Firebase";
import LoadingIndicator from "../Loading";
import { withUser } from "../Session";

interface CharacterSheetProps {
    firebase: Firebase;
    currentUser: User;
    characterId: string;
}

interface CharacterSheetState {
    characterDetails: any | null;
    loading: boolean;
}

class CharacterSheetBase extends Component<CharacterSheetProps, CharacterSheetState> {
    characterListener!: Unsubscribe;

    constructor(props: any) {
        super(props);

        this.state = {
            characterDetails: null, 
            loading: false
        };
        
        this.setCharacterListener();
    }

    componentDidMount() {
        this.setCharacterListener();
    }

    componentWillUnmount() {
        if(this.characterListener) {
            this.characterListener();
        }
    }

    setCharacterListener = () => {
        this.characterListener = this.props.firebase?.addCharacterListener(
            this.props.characterId, 
            doc => {
                this.setState({
                    characterDetails: doc.data()
                }); 
                // console.log(this.state.characterDetails);
            }
        );
    }

    updateValue = (property: string) => (newValue: string) => {
        this.props.firebase.updateCharacterData(
            this.props.characterId, 
            property, 
            isNaN(+newValue) ? newValue : +newValue
        );
    }

    render() {
        console.log("Character Id: " + this.props.characterId);
        return (
            <div>
                <h2>Character sheet for {this.state.characterDetails?.name}</h2>
                <h3>{this.state.characterDetails?.race} {this.state.characterDetails?.class}</h3>
                <hr />
                <LoadingIndicator showSpinner={this.state.loading} />
                {
                    this.state.characterDetails ?
                    <div className="charSheet">
                        <Attributes 
                            attributes={this.state.characterDetails.attributes} />
                        <BasicStats 
                            characterDetails={this.state.characterDetails} 
                            onInitiativeChange={this.updateValue("initiative")}
                            onHpChange={this.updateValue("currentHp")}
                            onFpChange={this.updateValue("currentFp")}/>
                        <Weapons 
                            weaponList={this.state.characterDetails.weapons} 
                            characterId={this.props.characterId} />
                        <Abilities 
                            abilityList={this.state.characterDetails.abilities} 
                            characterId={this.props.characterId} />
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
                        <Armors 
                            armorName={this.state.characterDetails.armor} 
                            resistances={this.state.characterDetails.resistanceToFlat} />
                        <Defenses 
                            attributes={this.state.characterDetails.attributes} />
                        <Skills 
                            skills={this.state.characterDetails.skills} />
                    </div>
                    : <p>Unable to load character data.</p>
                } 
            </div>
        )
    }
}

const CharacterSheet = withUser(withFirebase(CharacterSheetBase));

export default CharacterSheet;