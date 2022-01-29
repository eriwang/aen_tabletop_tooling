import { User } from "firebase/auth";
import { Component, ReactNode } from "react";
import Firebase, { withFirebase } from "../Firebase";
import { withUser } from "../Session";

const ProfilesPage = () => (
    <div>
        <ProfileManagement />
    </div>
)

interface ProfileManagementProps {
    firebase: Firebase;
    user: User;
}

interface ProfileManagementState {
    profileId: string;
    result: string;
    error: any | null;
}

class ProfileManagementBase extends Component<ProfileManagementProps, ProfileManagementState> {
    constructor(props: any) {
        super(props);

        this.state = {
            profileId: "",
            result: "",
            error: null
        }
    }

    render() {
        return (
            <div>
                <h1>Profile Management</h1>
            </div>
        )
    }
}

const ProfileManagement = withFirebase(withUser(ProfileManagementBase));

export default ProfilesPage;

export { ProfileManagement };