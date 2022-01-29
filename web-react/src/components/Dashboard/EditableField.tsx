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
        console.log(target.value);
        this.setState({"value": target.value});
    }

    render() {
        const {value} = this.state;
        const hasNotChanged = this.props.initialValue === this.state.value;

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <textarea 
                        name="value" 
                        value={value} 
                        rows={8} 
                        onChange={this.onChange} 
                        onKeyPress={event => {if(event.key === "Enter"){event.stopPropagation()}}}
                        />
                    <br />
                    <button type="submit" disabled={hasNotChanged}>Update</button>
                </form>
            </div>
        )
    }
}

export default EditableField