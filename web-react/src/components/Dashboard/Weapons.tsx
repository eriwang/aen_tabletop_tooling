import { ChangeEvent, Component, FormEvent } from "react";
import Firebase, { withFirebase } from "../Firebase";

interface WeaponsProps {
    weaponList: any[];
    characterId: string;
    charactersList: Map<string, string>;
}

interface WeaponsState {
    weaponMap: Map<string, any>;
    currentWeapon: string;
    showCalculator: boolean;
}

class Weapons extends Component<WeaponsProps, WeaponsState> {
    constructor(props: any) {
        super(props);

        console.log(this.props.charactersList);

        const weaponMap: Map<string, any> = new Map();
        this.props.weaponList.forEach(weapon => {
            weaponMap.set(weapon.name, weapon);
        });
        this.state = {weaponMap: weaponMap, currentWeapon: "", showCalculator: false};
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

    render() {
        const {currentWeapon, showCalculator, weaponMap} = this.state

        let weaponOptions = this.props.weaponList
            .map((weapon, index) => <option value={weapon.name} key={index}>{weapon.name}</option>);

        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <th colSpan={2}>
                            Basic Attack
                        </th>
                    </tr>

                    <tr>
                        <th>
                            Weapon
                        </th>
                        <th>
                            <form onSubmit={this.onSubmit}>
                                <select name="currentWeapon" value={currentWeapon} placeholder="Weapon" onChange={this.onChange}>
                                    <option value={""} key="Not selected"></option>
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
                        <td>
                            Range
                        </td>
                        <td>
                            {weaponMap.get(currentWeapon).range}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Primary Attribute
                        </td>
                        <td>
                            {weaponMap.get(currentWeapon).attribute}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Attack Type
                        </td>
                        <td>
                            {weaponMap.get(currentWeapon).attackType}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            To Hit (+ Roll, vs Defenses)
                        </td>
                        <td>
                            ceiling({weaponMap.get(currentWeapon).attribute} * {weaponMap.get(currentWeapon).toHitMultiplier}) - {weaponMap.get(currentWeapon).difficultyClass}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Damage (- Resistances)
                        </td>
                        <td>
                            ceiling({weaponMap.get(currentWeapon).attribute} * {weaponMap.get(currentWeapon).damageMultiplier}) + {weaponMap.get(currentWeapon).baseDamage}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Damage Type
                        </td>
                        <td>
                            {weaponMap.get(currentWeapon).damageType}
                        </td>
                    </tr>
                    </tbody>
                    }
                </table>
                {showCalculator && <AttackCalculator attackerId={this.props.characterId} weaponName={currentWeapon} charactersList={this.props.charactersList} />}
            </div>
        )
    }
}

interface AttackCalculatorProps {
    firebase: Firebase;
    attackerId: string;
    weaponName: string;
    charactersList: Map<string, string>;
}

interface AttackCalculatorState {
    defenderId: string;
    roll: number;
    loading: boolean;
    result: {
        doesAttackHit: boolean;
        damage: number;
        attackerToHit: number;
        defenderEvade: number;
    } | null;
    error: any | null;
}

class AttackCalculatorBase extends Component<AttackCalculatorProps, AttackCalculatorState> {
    constructor(props: any) {
        super(props);

        this.state = {
            defenderId: "",
            roll: 0,
            loading: false,
            result: null,
            error: null
        }
    }

    onSubmit = (event: FormEvent) => {
        console.log("Calling function with:" +
        "\n\tAttacker = " + this.props.attackerId +
        "\n\tDefender = " + this.state.defenderId +
        "\n\tWeapon = " + this.props.weaponName +
        "\n\tDice Roll = " + this.state.roll);
        this.setState({loading: true, result: null, error: null});
        this.props.firebase?.calculateAttack(
            this.props.attackerId,
            this.state.defenderId,
            this.props.weaponName,
            this.state.roll
        )
            .then(result => {
                const output = {
                    doesAttackHit: result.doesAttackHit,
                    damage: result.damage,
                    attackerToHit: result.attackerToHit,
                    defenderEvade: result.defenderEvade
                }
                this.setState({ result: output, error: null, loading: false });
            })
            .catch(error => {
                console.log(error);
                this.setState({ error: error, result: null, loading: false });
            })
        event.preventDefault();
    }

    onChange = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        const newState = { [target.name]: target.value } as any as Pick<AttackCalculatorState, keyof AttackCalculatorState>;
        this.setState(newState);
    }

    render() {
        const {defenderId, roll, loading, result, error} = this.state;

        let characterOptions = Array.from(this.props.charactersList.keys())
            .map(id => <option value={id} key={id}>{this.props.charactersList.get(id)}</option>);

            return (
                <div>
                    <h2>Calculate Attack</h2>
                    <p>Using {this.props.weaponName} to attack.</p>
                    <form onSubmit={this.onSubmit}>
                    <select name="defenderId" value={defenderId} placeholder="Opponent" onChange={this.onChange}>
                        <option value={""} key="Not selected"></option>
                        {characterOptions}
                    </select>
                    <input name="roll" value={roll} onChange={this.onChange} type="number" min="0" placeholder="Dice Roll"/>
                    <button type="submit">Attack</button>
                    </form>
                    {this.state.loading && <p>Loading...</p>}
                    {
                        result && 
                        <div>
                            <p><strong>Result: </strong></p>
                            <p>{result.doesAttackHit ? "Hit!" : "Miss..."}</p>
                            <p>{result.doesAttackHit ? result.damage : 0} damage dealt</p>
                            <p>Attacker's To-hit was {result.attackerToHit} versus Defender's Evasion of {result.defenderEvade}</p>
                        </div>
                    }
                    {error && <p>{error.message}</p>}
                </div>
            )
    }
}

const AttackCalculator = withFirebase(AttackCalculatorBase);

export default Weapons;

export {AttackCalculator};