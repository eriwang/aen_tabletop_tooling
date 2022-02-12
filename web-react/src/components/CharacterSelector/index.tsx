import { Unsubscribe } from "firebase/auth";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { ChangeEvent, Component } from "react";
import Firebase, { withFirebase } from "../Firebase";


interface CharacterSelectorProps {
    firebase: Firebase;
    initialValue: string;
    onChange: (charId: string) => any;
}

interface CharacterSelectorState {
    currentCharacter: string;
    charactersList: {[key: string]: string};
}

class CharacterSelectorBase extends Component<CharacterSelectorProps, CharacterSelectorState> {
    characterListListener: Unsubscribe;

    constructor(props: any) {
        super(props);

        console.log("CharacterSelector created");
        this.state = {
            charactersList: {},
            currentCharacter: this.props.initialValue
        }

        const characterListCallbacks = {
            added: (doc: DocumentSnapshot<DocumentData>) => {
                let {charactersList} = this.state;
                // console.log("added");
                const newCharacterDetails = doc.data();
                charactersList[doc.id] = newCharacterDetails!.name;
                this.setState({charactersList: charactersList});
            },
            removed: (doc: DocumentSnapshot<DocumentData>) => {
                let {charactersList} = this.state;
                // console.log("removed");
                delete charactersList[doc.id];
                this.setState({charactersList: charactersList});
            }
        };
        this.characterListListener = this.props.firebase.addCharactersListener(characterListCallbacks);
    }

    componentWillUnmount() {
        // console.log("Cleaning up CharacterSelector listener");
        this.characterListListener();
    }

    componentDidUpdate = (prevProps: CharacterSelectorProps) => {
        //console.log("CharacterSelector updated");
        if(
            this.props.initialValue !== prevProps.initialValue &&
            this.props.initialValue !== this.state.currentCharacter
        ) {
            this.setState({currentCharacter: this.props.initialValue})
        }
    }

    onChange = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        this.setState({ currentCharacter: target.value });
        this.props.onChange(target.value);
    }

    render() {
        const {charactersList, currentCharacter} = this.state;

        let characterOptions = Object.entries(charactersList)
            .map(([id, name], index) =>
                <option value={id} key={id}>{name}</option>
            );

        return (
            <select name="currentCharacter" value={currentCharacter} onChange={this.onChange} id="characterSelector">
                <option value={""} key="Not selected"></option>
                {characterOptions}
            </select>
        )
    }
}

const CharacterSelector = withFirebase(CharacterSelectorBase);

export default CharacterSelector;