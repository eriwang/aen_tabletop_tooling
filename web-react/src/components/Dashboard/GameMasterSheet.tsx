import { User } from "firebase/auth";
import { Unsubscribe } from "firebase/firestore";
import React, { Component } from "react";
import Firebase, { withFirebase } from "../Firebase";
import { withUser } from "../Session";

interface GameMasterSheetProps {
    firebase: Firebase;
    currentUser: User;
}

interface GameMasterSheetState {
    characterDetails: any | null;
    characterId: string | null;
    charactersList: Map<string, string>;
}

class GameMasterSheetBase extends Component<GameMasterSheetProps, GameMasterSheetState> {
    characterListListener: Unsubscribe | null;

    constructor(props: any) {
        super(props);
        
        this.characterListListener = null;
    }

    render() {
        return (
            <div>
                <h2>Game Master sheet</h2>
            </div>
        )
    }
}

const GameMasterSheet = withUser(withFirebase(GameMasterSheetBase));

export default GameMasterSheet;