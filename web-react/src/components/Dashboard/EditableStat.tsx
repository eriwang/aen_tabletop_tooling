import { ChangeEvent, Component, FormEvent } from "react";
import Firebase, { withFirebase } from "../Firebase";

interface EditableStatProps {
    character: string;
    statName: string;
    prettyName: string;
    initialValue: any;
    firebase: Firebase;
}

interface EditableStatState {
    value: any;
}

class EditableStatBase extends Component<EditableStatProps, EditableStatState> {
    constructor(props: any) {
        super(props);

        console.log(this.props.initialValue);
        this.state = {value: this.props.initialValue}
    }

    onSubmit = (event: FormEvent) => {
        this.props.firebase.updateCharacterData(
            this.props.character,
            this.props.statName,
            this.state.value
        )
            .then(() => {
                console.log("Updated character value successfully");
            })
            .catch(error => console.log(error));

        event.preventDefault();
    }

    onChange = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        const newState = { [target.name]: target.value } as Pick<EditableStatState, "value">
        this.setState(newState);
    }

    render() {
        const {value} = this.state;

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <p><strong>{this.props.prettyName}</strong></p>
                    <input name="value" value={value || '?'} onChange={this.onChange} type="text" placeholder={this.props.statName} />
                    <button type="submit">Update</button>
                </form>
            </div>
        )
    }
}

const EditableStat = withFirebase(EditableStatBase);

export default EditableStat