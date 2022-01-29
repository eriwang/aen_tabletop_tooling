import { DocumentData, DocumentSnapshot, Unsubscribe } from "firebase/firestore";
import { Component } from "react";
import Firebase, { withFirebase } from "../Firebase";
import LoadingIndicator from "../Loading";

const ProfilesPage = () => (
    <div>
        <h1>Profile Management</h1>
        <ProfileManagement />
    </div>
)

interface ProfileManagementProps {
    firebase: Firebase;
}

interface ProfileManagementState {
    profilesList: {[key: string]: string};
    profileId: string;
    result: string | null;
    error: any | null;
}

class ProfileManagementBase extends Component<ProfileManagementProps, ProfileManagementState> {
    profileListListener: Unsubscribe;

    constructor(props: any) {
        super(props);

        this.state = {
            profilesList: {},
            profileId: "",
            result: null,
            error: null
        }

        const profileListCallbacks = {
            added: (doc: DocumentSnapshot<DocumentData>) => {
                let {profilesList} = this.state;
                profilesList[doc.id] = doc.id;
                this.setState({profilesList: profilesList});
            },
            removed: (doc: DocumentSnapshot<DocumentData>) => {
                let {profilesList} = this.state;
                delete profilesList[doc.id];
                this.setState({profilesList: profilesList});
            }
        };
        this.profileListListener = this.props.firebase.addProfilesListener(profileListCallbacks);
    }

    componentWillUnmount() {
        this.profileListListener();
    }

    selectProfile = (profileId: string) => () => {
        this.setState({profileId: profileId, result: null, error: null});
        // console.log(profileId);
        this.props.firebase.buildCharacter(profileId)
            .then(result => {
                this.setState({result: `Successfully generated character with ID ${result.characterId}`});
                console.log(result);
            })
            .catch(error => {
                this.setState({error: error.message});
                console.error(error);
            })
    }

    render() {
        const {profilesList, profileId, result, error} = this.state;

        let profileOptions = Object.entries(profilesList)
        .map(([_, profileName], index) =>
            <tr key={index}>
                <td>{profileName}</td>
                <td><button onClick={this.selectProfile(profileName)}>Build</button></td>
            </tr>
        );

        return (
            <div>
                <table>
                    <thead>
                        <tr><th colSpan={2}>Profiles</th></tr>
                    </thead>
                    <tbody>
                        {profileOptions}
                    </tbody>
                </table>
                {profileId !== "" && <h2>Result for building {profileId}:</h2>}
                <LoadingIndicator showSpinner={profileId !== "" && !result && !error} />
                {result && <p>{result}</p>}
                {error && <p className="error">{error}</p>}
            </div>
        )
    }
}

const ProfileManagement = withFirebase(ProfileManagementBase);

export default ProfilesPage;

export { ProfileManagement };