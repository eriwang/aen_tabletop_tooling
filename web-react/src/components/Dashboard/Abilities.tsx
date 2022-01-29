import { ChangeEvent, Component, FormEvent } from "react";
import { AttackCalculator } from ".";

interface AbilitiesProps {
    abilityList: any[];
    characterId: string;
}

interface AbilitiesState {
    abilityMap: {[key: string]: any};
    currentAbility: string;
    showCalculator: boolean;
}

class Abilities extends Component<AbilitiesProps, AbilitiesState> {
    constructor(props: any) {
        super(props);

        const abilityMap: {[key: string]: any} = {};
        if(this.props.abilityList) {
            this.props.abilityList.forEach(ability => {
                abilityMap[ability.name] = ability;
            });
            this.state = {abilityMap: abilityMap, currentAbility: this.props.abilityList[0].name, showCalculator: false};
        } else {
            this.state = {abilityMap: abilityMap, currentAbility: "", showCalculator: false};
        }
    }

    onChange = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        const newState = { [target.name]: target.value } as any as Pick<AbilitiesState, keyof AbilitiesState>;
        this.setState(newState);
    }

    onSubmit = (event: FormEvent) => {
        if(this.state.abilityMap[this.state.currentAbility].isAttack) {
            this.setState({showCalculator: true});
        } else {
            // Do something else here for buffs like "Ursine Form"
        }

        event.preventDefault();
    }

    closeCalculator = () => {
        this.setState({showCalculator: false});
    }

    render() {
        const {currentAbility, showCalculator, abilityMap} = this.state

        let abilityOptions = this.props.abilityList ? this.props.abilityList
            .map((ability, index) => (
                <div key={index}>
                    <input style={{height: "150px"}} type="radio" value={ability.name} id={ability.name} name="currentAbility" onChange={this.onChange} defaultChecked={index === 0} />
                    <label htmlFor={ability.name}>{ability.name}</label>
                </div>
            )) : <div></div>;

        return (
            <div>
                <table>
                    <thead>
                    <tr><th colSpan={3}>Abilities</th></tr>
                    </thead>

                    {this.props.abilityList ? 
                        (currentAbility !== "" &&
                        <tbody>
                        <tr>
                            <td rowSpan={0}>
                                <div style={{overflowY: "scroll", height: "225px"}}>
                                <form onSubmit={this.onSubmit}>
                                    {abilityOptions}
                                    <hr />
                                    <button type="submit">Use</button>
                                </form>
                                </div>
                            </td>
                            <td colSpan={2} className="small">{abilityMap[currentAbility].category}: <i>{abilityMap[currentAbility].description}</i></td>
                        </tr>
                        <tr>
                            <td>Cooldown</td>
                            <td>{abilityMap[currentAbility].cooldown} turn(s)</td>
                        </tr>
                        <tr>
                            <td>Cost</td>
                            <td>{abilityMap[currentAbility].fpCost} FP</td>
                        </tr>
                        <tr>
                            <td>Range</td>
                            <td>{abilityMap[currentAbility].range}</td>
                        </tr>
                        <tr>
                            <td>Primary Attribute</td>
                            <td>{abilityMap[currentAbility].attribute}</td>
                        </tr>
                        <tr className="blue">
                            <td>Attack Type</td>
                            <td>{abilityMap[currentAbility].attackType}</td>
                        </tr>
                        <tr className="blue">
                            <td>To Hit <span className="subtext">(+ Roll, vs Defenses)</span></td>
                            <td>ceiling({abilityMap[currentAbility].attribute} * {abilityMap[currentAbility].toHitMultiplier}) - {abilityMap[currentAbility].hitDC}</td>
                        </tr>
                        <tr className="orange">
                            <td>Damage <span className="subtext">(- Resistances)</span></td>
                            <td>ceiling({abilityMap[currentAbility].attribute} * {abilityMap[currentAbility].damageMultiplier}) + {abilityMap[currentAbility].baseDamage}</td>
                        </tr>
                        <tr className="orange">
                            <td>Damage Type</td>
                            <td>{abilityMap[currentAbility].damageType}</td>
                        </tr>
                        </tbody>
                        )
                        : <tbody><tr><td colSpan={3}>None</td></tr></tbody>
                    }
                </table>
                {
                    showCalculator && 
                    <AttackCalculator 
                        attackerId={this.props.characterId} 
                        attackName={currentAbility}
                        onClose={this.closeCalculator} />
                }
            </div>
        )
    }
}

export default Abilities;