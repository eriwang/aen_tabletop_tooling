import { Component } from "react";
import { CharacterSheet, GameMasterSheet } from ".";

interface DashboardState {
    isGameMaster: boolean;
}

class DashboardPage extends Component<{}, DashboardState> {
    constructor(props: any) {
        super(props);

        this.state = {isGameMaster: false};
    }

    switchView = () => {
        this.setState({isGameMaster: !this.state.isGameMaster});
    }

    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <button onClick={this.switchView}>Switch view</button>
                {
                    this.state.isGameMaster 
                        ? <GameMasterSheet /> 
                        : <CharacterSheet />
                }
            </div>
        )
    }
}

export default DashboardPage;