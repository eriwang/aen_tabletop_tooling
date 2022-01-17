import { Component } from "react";

interface DefensesProps {
    attributes: {[key: string]: number}
}

class Defenses extends Component<DefensesProps, {}> {
    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr><th colSpan={2}>Defenses</th></tr>
                    </thead>

                    <tbody>
                    <tr className="blue">
                        <td>FOR <span className="subtext">(Strikes)</span></td>
                        <td>{Math.ceil(0.75 * (this.props.attributes.CON + this.props.attributes.STR))}</td>
                    </tr>
                    <tr className="blue">
                        <td>REF <span className="subtext">(Projectiles)</span></td>
                        <td>{Math.ceil(0.75 * (this.props.attributes.DEX + this.props.attributes.WIS))}</td>
                    </tr>
                    <tr className="blue">
                        <td>WILL <span className="subtext">(Curses)</span></td>
                        <td>{Math.ceil(0.75 * (this.props.attributes.INT + this.props.attributes.CHAR))}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Defenses;