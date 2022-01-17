import React from 'react';
import { SignInLink } from '../SignIn';
import { SignUpLink } from '../SignUp';

function LandingPage() {
    return (
        <div>
            <h1>[Name TBD] Tabletop Tool</h1>
            <p>Welcome adventurer</p>
            <SignInLink />
            <SignUpLink />
        </div>
    )
}

export default LandingPage;