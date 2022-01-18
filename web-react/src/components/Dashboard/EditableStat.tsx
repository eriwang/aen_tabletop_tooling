import { ChangeEvent, Component, FormEvent } from "react";

interface EditableStatProps {
    initialValue: any;
    onSubmit: ((newValue: string) => any);
}

interface EditableStatState {
    value: any;
}

class EditableStat extends Component<EditableStatProps, EditableStatState> {
    constructor(props: any) {
        super(props);

        //console.log(this.props.initialValue);
        this.state = {value: this.props.initialValue}
    }

    componentDidUpdate = (prevProps: EditableStatProps, prevState: EditableStatState) => {
        if(prevProps.initialValue !== this.props.initialValue) {
            this.setState({value: this.props.initialValue});
        }
    }

    onSubmit = (event: FormEvent) => {
        this.props.onSubmit(this.state.value);
        event.preventDefault();
    }

    onChange = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        const newState = { [target.name]: target.value } as Pick<EditableStatState, "value">
        this.setState(newState);
    }

    render() {
        const {value} = this.state;
        const hasNotChanged = this.state.value === this.props.initialValue;

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input name="value" value={value} onChange={this.onChange} type="number" />
                    <button type="submit" disabled={hasNotChanged}>Update</button>
                </form>
            </div>
        )
    }
}

export default EditableStat