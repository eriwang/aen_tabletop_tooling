import { Component } from "react";

interface SkillsProps {
    skills: {[key: string]: number}
}

class Skills extends Component<SkillsProps, {}> {
    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr><th colSpan={2}>Skills</th></tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td><span className="subtext">DEX</span> Acrobatics</td>
                        <td>{this.props.skills.Acrobatics}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">INT</span> Arcana</td>
                        <td>{this.props.skills.Arcana}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">STR</span> Athletics</td>
                        <td>{this.props.skills.Athletics}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">INT</span> Culture</td>
                        <td>{this.props.skills.Culture}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">CHAR</span> Deception</td>
                        <td>{this.props.skills.Deception}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">CON</span> Endurance</td>
                        <td>{this.props.skills.Endurance}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">INT</span> History</td>
                        <td>{this.props.skills.History}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">CHAR</span> Insight</td>
                        <td>{this.props.skills.Insight}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">CHAR</span> Intimidation</td>
                        <td>{this.props.skills.Intimidation}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">INT</span> Investigation</td>
                        <td>{this.props.skills.Investigation}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">WIS</span> Medicine</td>
                        <td>{this.props.skills.Medicine}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">WIS</span> Nature</td>
                        <td>{this.props.skills.Nature}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">CHAR</span> Performance</td>
                        <td>{this.props.skills.Performance}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">CHAR</span> Persuasion</td>
                        <td>{this.props.skills.Persuasion}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">WIS</span> Religion</td>
                        <td>{this.props.skills.Religion}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">DEX</span> Sleight of Hand</td>
                        <td>{this.props.skills.SleightOfHand}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">WIS</span> Stealth</td>
                        <td>{this.props.skills.Stealth}</td>
                    </tr>
                    <tr>
                        <td><span className="subtext">WIS</span> Survival</td>
                        <td>{this.props.skills.Survival}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Skills;