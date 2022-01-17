import React, { ChangeEvent, Component, FormEvent } from 'react';
import { Link, NavigateFunction } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Firebase, { withFirebase } from '../Firebase';
import { withRouter } from '../Navigation';
import { SignUpLink } from '../SignUp';

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null
}

function SignInPage() {
    return (
        <div>
            <h1>Sign in</h1>
            <SignInForm />
            <SignUpLink />
        </div>
    )
}

interface SignInProps {
    firebase: Firebase,
    navigate: NavigateFunction
}

interface SignInState {
    email: string;
    password: string;
    error: any;
}

class SignInFormBase extends Component<SignInProps, SignInState> {
    constructor(props: any) {
        super(props);

        this.state = {...INITIAL_STATE}
    }

    onSubmit = (event: FormEvent) => {
        const { email, password } = this.state;

        this.props.firebase
          .doSignInWithEmailAndPassword(email, password)
          .then(() => {
              this.setState({...INITIAL_STATE})
              this.props.navigate(ROUTES.HOME)
          })
          .catch((error: any) => {
              this.setState({error})
          });

        event.preventDefault();
    };

    onChange = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        const newState = { [target.name]: target.value } as Pick<SignInState, keyof SignInState>;
        this.setState(newState);
    }

    render() {
        const {email, password, error} = this.state;

        const isInvalid = (password === '') || (email === '');

        return (
            <div>
                <p>All fields are required.</p>
                <form onSubmit={this.onSubmit}>
                    <input name="email" value={email} onChange={this.onChange} type="email" placeholder="Email"/>
                    <input name="password" value={password} onChange={this.onChange} type="password" placeholder="Password"/>
                    <button disabled={isInvalid} type="submit">Submit</button>

                    {error && <p>{error.message}</p>}
                </form>
            </div>
        )
    }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));

const SignInLink = () => (
    <p>Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link></p>
)

export default SignInPage;

export { SignInForm, SignInLink }