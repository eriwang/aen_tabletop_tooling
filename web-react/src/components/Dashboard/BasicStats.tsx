import { Component } from "react";
import { EditableStat } from ".";

interface BasicStatsProps {
    characterDetails: any;
    onInitiativeChange: ((newValue: string) => any);
    onHpChange: ((newValue: string) => any);
    onFpChange: ((newValue: string) => any);
}

class BasicStats extends Component<BasicStatsProps, {}> {
    render() {
        if(!this.props.characterDetails) {
            return <div>Basic stats loading...</div>
        }
        return (
            <div>
                <table>
                    <thead>
                    <tr><th colSpan={2}>Core Stats</th></tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td>Level</td>
                        <td>{this.props.characterDetails.level}</td>
                    </tr>
                    <tr>
                        <td>Initiative</td>
                        <td><EditableStat initialValue={this.props.characterDetails.initiative} onSubmit={this.props.onInitiativeChange} /></td>
                    </tr>
                    <tr>
                        <td>Movement</td>
                        <td>{this.props.characterDetails.movement}</td>
                    </tr>
                    <tr>
                        <td>Current HP</td>
                        <td><EditableStat initialValue={this.props.characterDetails.currentHp} onSubmit={this.props.onHpChange} /></td>
                    </tr>
                    <tr>
                        <td>Total HP</td>
                        <td>{this.props.characterDetails.maxHp}</td>
                    </tr>
                    <tr>
                        <td>Current FP</td>
                        <td><EditableStat initialValue={this.props.characterDetails.currentFp} onSubmit={this.props.onFpChange} /></td>
                    </tr>
                    <tr>
                        <td>Total FP</td>
                        <td>{this.props.characterDetails.maxFp}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default BasicStats;