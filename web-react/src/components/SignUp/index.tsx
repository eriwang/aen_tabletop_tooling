import React, { ChangeEvent, Component, FormEvent } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Firebase, { withFirebase } from '../Firebase';
import { withRouter } from '../Navigation';

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null
}

function SignUpPage() {
    return (
        <div>
            <h1>Sign Up</h1>
            <SignUpForm />
        </div>
    )
}

interface SignUpProps {
    firebase: Firebase,
    navigate: NavigateFunction
}

interface SignUpState {
    username: string;
    email: string;
    passwordOne: string;
    passwordTwo: string;
    error: any;
}

class SignUpFormBase extends Component<SignUpProps, SignUpState> {
    constructor(props: any) {
        super(props);

        this.state = {...INITIAL_STATE}
    }

    onSubmit = (event: FormEvent) => {
        const { username, email, passwordOne } = this.state;

        this.props.firebase
          .doCreateUserWithEmailAndPassword(email, passwordOne)
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
        const newState = { [target.name]: target.value } as Pick<SignUpState, keyof SignUpState>;
        this.setState(newState);
    }

    render() {
        const {username, email, passwordOne, passwordTwo, error} = this.state;

        const isInvalid = (passwordOne !== passwordTwo) || (passwordOne === '') || (email === '') || (username === '');

        // const isInvalid = () => {
        //     let errorMessage = '';
        //     if (username === '') {
        //         errorMessage += ' Username is required.';
        //     }
        //     if (email === '') {
        //         errorMessage += ' Email Address is required.';
        //     }
        //     if (passwordOne === '') {
        //         errorMessage += ' Password is required.';
        //     }
        //     if (passwordOne !== passwordTwo) {
        //         errorMessage += ' Passwords do not match.'
        //     }
        //     if (errorMessage !== '') {
        //         this.setState({error: {message: errorMessage.substring(1)}});
        //         return true;
        //     }
        //     this.setState({error: null});
        //     return false;
        // }

        return (
            <div>
                <p>All fields are required.</p>
                <form onSubmit={this.onSubmit}>
                    <input name="username" value={username} onChange={this.onChange} type="text" placeholder="Username"/>
                    <input name="email" value={email} onChange={this.onChange} type="email" placeholder="Email"/>
                    <input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Password"/>
                    <input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Confirm password"/>
                    <button disabled={isInvalid} type="submit">Submit</button>

                    {error && <p>{error.message}</p>}
                </form>
            </div>
        )
    }
}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

const SignUpLink = () => (
    <p>Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link></p>
)

export default SignUpPage;

export { SignUpForm, SignUpLink }