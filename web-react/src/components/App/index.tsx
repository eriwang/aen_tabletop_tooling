import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import HomePage from '../Home';
import SignInPage from '../SignIn';
import SignUpPage from '../SignUp';
import ForgotPasswordPage from '../ForgotPassword';

import * as ROUTES from '../../constants/routes';

const App = () => (
    <BrowserRouter>
        <div>
            <Navigation />

            <hr />

            <Routes>
                <Route path={ROUTES.LANDING} element={<LandingPage />} />
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
                <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            </Routes>
        </div>
    </BrowserRouter>
);

export default App;