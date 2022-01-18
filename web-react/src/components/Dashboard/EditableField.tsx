import { ChangeEvent, Component, FormEvent } from "react";

interface EditableFieldProps {
    initialValue: any;
    onSubmit: ((newValue: string) => any);
}

interface EditableFieldState {
    value: any;
}

class EditableField extends Component<EditableFieldProps, EditableFieldState> {
    constructor(props: any) {
        super(props);

        //console.log(this.props.initialValue);
        this.state = {value: this.props.initialValue}
    }

    componentDidUpdate = (prevProps: EditableFieldProps, prevState: EditableFieldState) => {
        if(this.state.value !== this.props.initialValue) {
            this.setState({value: this.props.initialValue});
        }
    }

    onSubmit = (event: FormEvent) => {
        this.props.onSubmit(this.state.value);
        event.preventDefault();
    }

    onChange = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        const newState = { [target.name]: target.value } as Pick<EditableFieldState, "value">
        this.setState(newState);
    }

    render() {
        const {value} = this.state;

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <textarea name="value" value={value} rows={8} onChange={this.onChange} />
                    <br />
                    <button type="submit">Update</button>
                </form>
            </div>
        )
    }
}

export default EditableField