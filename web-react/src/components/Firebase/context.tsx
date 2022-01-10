import React, { Component } from 'react';
import Firebase from './firebase';

const FirebaseContext = React.createContext<Firebase | null>(null);

export const withFirebase = (Component: React.ComponentType<any>) => (props: any) => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
)

export default FirebaseContext;