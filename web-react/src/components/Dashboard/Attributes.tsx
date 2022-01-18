import { Component } from "react";

interface AttributesProps {
    attributes: any
}

class Attributes extends Component<AttributesProps, {}> {
    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr><th colSpan={2}>Attributes</th></tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td>CON</td>
                        <td>{this.props.attributes?.CON}</td>
                    </tr>
                    <tr>
                        <td>STR</td>
                        <td>{this.props.attributes?.STR}</td>
                    </tr>
                    <tr>
                        <td>DEX</td>
                        <td>{this.props.attributes?.DEX}</td>
                    </tr>
                    <tr>
                        <td>WIS</td>
                        <td>{this.props.attributes?.WIS}</td>
                    </tr>
                    <tr>
                        <td>INT</td>
                        <td>{this.props.attributes?.INT}</td>
                    </tr>
                    <tr>
                        <td>CHAR</td>
                        <td>{this.props.attributes?.CHAR}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Attributes;