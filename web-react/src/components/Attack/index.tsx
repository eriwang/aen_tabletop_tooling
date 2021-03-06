import { User } from "firebase/auth";
import { ChangeEvent, Component, FormEvent } from "react";
import Firebase, { withFirebase } from "../Firebase";
import { withUser } from "../Session";

interface AttackProps {
    firebase: Firebase | null;
    currentUser: User | null;
}

interface AttackState {
    characterList: { [key: string]: string };
    attackerId: string;
    defenderId: string;
    weaponList: string[];
    weaponName: string;
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

class AttackPageBase extends Component<AttackProps, AttackState> {
    constructor(props: any) {
        super(props);

        this.state = {
            characterList: {},
            attackerId: "",
            defenderId: "",
            weaponList: [],
            weaponName: "",
            roll: 0,
            loading: false,
            result: null,
            error: null
        }

        this.getCharacterList();
    }

    onSubmit = (event: FormEvent) => {
        console.log("Calling function with:" +
        "\n\tAttacker = " + this.state.attackerId +
        "\n\tDefender = " + this.state.defenderId +
        "\n\tWeapon = " + this.state.weaponName +
        "\n\tDice Roll = " + this.state.roll);
        this.setState({loading: true, result: null, error: null});
        this.props.firebase?.calculateAttack(
            this.state.attackerId,
            this.state.defenderId,
            this.state.weaponName,
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
        const newState = { [target.name]: target.value } as any as Pick<AttackState, keyof AttackState>;
        this.setState(newState);
    }

    componentDidUpdate = (prevProps: AttackProps, prevState: AttackState) => {
        if(prevState.attackerId !== this.state.attackerId) {
            if(this.state.attackerId === "") {
                this.setState({ weaponList: [] });
            } else {
                this.getWeaponList();
            }
        }
    }

    getCharacterList = () => {
        this.props.firebase!.getCharactersData()
            .then(snapshot => {
                let characterList: { [key: string]: string } = {};
                snapshot?.forEach((doc) => {
                    const data = doc.data();
                    characterList[doc.id] = data['name'];
                });
                this.setState({ characterList: characterList });
            })
            .catch(error => {
                this.setState({ error: error });
            });
    }

    getWeaponList = () => {
        this.props.firebase?.getCharacterData(this.state.attackerId!)
            .then(characterDetails => {
                let weaponList: string[] = [];
                characterDetails?.weapons.forEach((weapon: any) => {
                    weaponList.push(weapon.name);
                })
                this.setState({ weaponList: weaponList });
            })
            .catch(error => {this.setState({error: error}); console.log(error)});
    }

    render() {
        const {attackerId, defenderId, weaponName, roll, result, error} = this.state;

        let characterOptions = Object.entries(this.state.characterList)
            .map(([id, name]) => <option value={id} key={id}>{name}</option>);
        let weaponOptions = this.state.weaponList
            .map(name => <option value={name} key={name}>{name}</option>);

        return (
            <div>
                <h1>Calculate Attack</h1>
                <form onSubmit={this.onSubmit}>
                    <p><strong>Attacker:</strong></p>
                    <select name="attackerId" value={attackerId} placeholder="Attacker" onChange={this.onChange}>
                        <option value={""} key="Not selected"></option>
                        {characterOptions}
                    </select>
                    <p><strong>Defender:</strong></p>
                    <select name="defenderId" value={defenderId} placeholder="Defender" onChange={this.onChange}>
                        <option value={""} key="Not selected"></option>
                        {characterOptions}
                    </select>
                    <p><strong>Weapon:</strong></p>
                    <select name="weaponName" value={weaponName} placeholder="Weapon" onChange={this.onChange}>
                        <option value={""} key="Not selected"></option>
                        {weaponOptions}
                    </select>
                    <p><strong>Dice Roll:</strong></p>
                    <input name="roll" value={roll} onChange={this.onChange} type="number" min="0" placeholder="Dice Roll"/>
                    <p></p>
                    <button type="submit">Attack!</button>
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

const AttackPage = withUser(withFirebase(AttackPageBase));

export default AttackPage;