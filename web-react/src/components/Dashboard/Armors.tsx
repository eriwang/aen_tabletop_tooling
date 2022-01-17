import { ChangeEvent, Component, FormEvent } from "react";

interface ArmorsProps {
    armorName: string;
    resistances: any;
}

class Armors extends Component<ArmorsProps, {}> {
    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr><th colSpan={6}>Resistances</th></tr>
                    <tr>
                        <th colSpan={6}>Armor: {this.props.armorName}</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr className="orange">
                        <td>Slashing</td>
                        <td>{this.props.resistances.Slashing}</td>
                        <td>Fire</td>
                        <td>{this.props.resistances.Fire}</td>
                        <td>Radiant</td>
                        <td>{this.props.resistances.Radiant}</td>
                    </tr>
                    <tr className="orange">
                        <td>Bludgeoning</td>
                        <td>{this.props.resistances.Bludgeoning}</td>
                        <td>Water</td>
                        <td>{this.props.resistances.Water}</td>
                        <td>Necrotic</td>
                        <td>{this.props.resistances.Necrotic}</td>
                    </tr>
                    <tr className="orange">
                        <td>Piercing</td>
                        <td>{this.props.resistances.Piercing}</td>
                        <td>Earth</td>
                        <td>{this.props.resistances.Earth}</td>
                        <td>Psychic</td>
                        <td>{this.props.resistances.Psychic}</td>
                    </tr>
                    <tr className="orange">
                        <td>Poison</td>
                        <td>{this.props.resistances.Poison}</td>
                        <td>Air</td>
                        <td>{this.props.resistances.Air}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Armors;