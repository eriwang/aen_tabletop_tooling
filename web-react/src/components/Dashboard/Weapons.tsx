import { ChangeEvent, Component, FormEvent } from "react";
import { AttackCalculator } from ".";

interface WeaponsProps {
    weaponList: any[];
    characterId: string;
}

interface WeaponsState {
    weaponMap: {[key: string]: any};
    currentWeapon: string;
    showCalculator: boolean;
}

class Weapons extends Component<WeaponsProps, WeaponsState> {
    constructor(props: any) {
        super(props);

        const weaponMap: {[key: string]: any} = {};
        this.props.weaponList.forEach(weapon => {
            weaponMap[weapon.name] = weapon;
        });
        this.state = {
            weaponMap: weaponMap, 
            currentWeapon: this.props.weaponList.length > 0 ? this.props.weaponList[0].name : "", 
            showCalculator: false
        };
    }

    onChange = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        const newState = { [target.name]: target.value } as any as Pick<WeaponsState, keyof WeaponsState>;
        this.setState(newState);
    }

    onSubmit = (event: FormEvent) => {
        this.setState({showCalculator: true});

        event.preventDefault();
    }

    closeCalculator = () => {
        this.setState({showCalculator: false});
    }

    render() {
        const {currentWeapon, showCalculator, weaponMap} = this.state

        let weaponOptions = this.props.weaponList
            .map((weapon, index) => <option value={weapon.name} key={index}>{weapon.name}</option>);

        return (
            <div>
                <table>
                    <thead>
                    <tr><th colSpan={2}>Basic Attack</th></tr>
                    <tr>
                        <th>Weapon</th>
                        <th>
                            <form onSubmit={this.onSubmit}>
                                <select name="currentWeapon" value={currentWeapon} placeholder="Weapon" onChange={this.onChange}>
                                    <option value={""} key="Not selected">Select a weapon</option>
                                    {weaponOptions}
                                </select>
                                <button type="submit">Use</button>
                            </form>
                        </th>
                    </tr>
                    </thead>

                    {currentWeapon !== "" &&
                    <tbody>
                    <tr>
                        <td>Range</td>
                        <td>{weaponMap[currentWeapon].range}</td>
                    </tr>
                    <tr>
                        <td>Primary Attribute</td>
                        <td>{weaponMap[currentWeapon].attribute}</td>
                    </tr>
                    <tr className="blue">
                        <td>Attack Type</td>
                        <td>{weaponMap[currentWeapon].attackType}</td>
                    </tr>
                    <tr className="blue">
                        <td>To Hit <span className="subtext">(+ Roll, vs Defenses)</span></td>
                        <td>ceiling({weaponMap[currentWeapon].attribute} * {weaponMap[currentWeapon].toHitMultiplier}) - {weaponMap[currentWeapon].hitDC}</td>
                    </tr>
                    <tr className="orange">
                        <td>Damage <span className="subtext">(- Resistances)</span></td>
                        <td>ceiling({weaponMap[currentWeapon].attribute} * {weaponMap[currentWeapon].damageMultiplier}) + {weaponMap[currentWeapon].baseDamage}</td>
                    </tr>
                    <tr className="orange">
                        <td>Damage Type</td>
                        <td>{weaponMap[currentWeapon].damageType}</td>
                    </tr>
                    </tbody>
                    }
                </table>
                {
                    showCalculator && 
                    <AttackCalculator 
                        attackerId={this.props.characterId} 
                        attackName={currentWeapon}
                        onClose={this.closeCalculator} />
                }
            </div>
        )
    }
}

export default Weapons;