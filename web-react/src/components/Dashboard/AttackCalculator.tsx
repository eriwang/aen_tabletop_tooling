import { ChangeEvent, Component, FormEvent } from "react";
import CharacterSelector from "../CharacterSelector";
import Firebase, { withFirebase } from "../Firebase";
import LoadingIndicator from "../Loading";

interface AttackCalculatorProps {
    firebase: Firebase;
    attackerId: string;
    attackName: string;
    onClose: () => any;
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
        "\n\tWeapon = " + this.props.attackName +
        "\n\tDice Roll = " + this.state.roll);
        this.setState({loading: true, result: null, error: null});
        this.props.firebase?.calculateAttack(
            this.props.attackerId,
            this.state.defenderId,
            this.props.attackName,
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

        return (
            <div className="cover"><div className="modal">
                <button onClick={this.props.onClose}>Back</button>
                <h2>Calculate Attack</h2>
                <p>Using {this.props.attackName} to attack.</p>
                <form onSubmit={this.onSubmit}>
                <label htmlFor="defenderSelector">Defender: </label>
                <CharacterSelector initialValue={defenderId} onChange={(charId: string) => this.setState({defenderId: charId})} />
                <br />
                <label htmlFor="rollEntry">Roll: </label>
                <input name="roll" value={roll} onChange={this.onChange} type="number" min="0" placeholder="Dice Roll" id="rollEntry" />
                <button type="submit">Attack</button>
                </form>
                {<LoadingIndicator showSpinner={loading}/>}
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
            </div></div>
        )
    }
}

const AttackCalculator = withFirebase(AttackCalculatorBase);

export default AttackCalculator;