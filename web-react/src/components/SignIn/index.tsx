import React from 'react';
import { FirebaseContext } from '../Firebase';

function SignInPage() {
    return (
        <FirebaseContext.Consumer>
            { firebase => <div>Sign in</div> }
        </FirebaseContext.Consumer>
    )
}

export default SignInPage;