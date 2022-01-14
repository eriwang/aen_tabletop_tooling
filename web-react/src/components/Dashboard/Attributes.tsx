import { Component } from "react";

interface AttributesProps {
    attributes: any
}

class Attributes extends Component<AttributesProps, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <p><strong>CON: </strong>{this.props.attributes?.CON}</p>
                <p><strong>STR: </strong>{this.props.attributes?.STR}</p>
                <p><strong>DEX: </strong>{this.props.attributes?.DEX}</p>
                <p><strong>WIS: </strong>{this.props.attributes?.WIS}</p>
                <p><strong>INT: </strong>{this.props.attributes?.INT}</p>
                <p><strong>CHAR: </strong>{this.props.attributes?.CHAR}</p>
            </div>
        )
    }
}

export default Attributes;