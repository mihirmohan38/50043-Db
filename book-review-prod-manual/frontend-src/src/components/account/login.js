import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from '../../services/accountService';
import { useHistory } from 'react-router-dom';

const AuthorsList = () => {
    return (
        <>
            <h3>This website is made possible by: </h3>
            <p>Rahul Bhattacharjee</p>
            <p>Mihir Mohan</p>
            <p>Joshua Teo</p>
            <p>Yang Aobo</p>
            <p>Koh Wilson</p>
        </>
    );
}

export default function Login() {
    const initialUserInfo = {
        'username': '',
        'email': ''
    }
    const { register, handleSubmit, errors } = useForm();
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(initialUserInfo);
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('account')) {
            setLoggedIn(true);
            setUserInfo(
                {
                    'username': JSON.parse(localStorage.getItem('account')).username,
                    'email': JSON.parse(localStorage.getItem('account')).email
                }
            )
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            const user = await signIn(data);
            if (user.status === 200) {
                localStorage.setItem('account', JSON.stringify(user.data));
                history.push('/');
            }
        } catch(err) {
            console.log(err);
            alert("Sign in failed, please try again");
        } finally {
            history.go(0);
        }
    }
    
    return (
        <div className="container">
            { loggedIn ? 
                        <div className="container">
                            <h2>My Account</h2>
                            <p>Name: {userInfo.username}</p>
                            <p>Email: {userInfo.email}</p>
                            <br/>
                            <AuthorsList />
                        </div>
                        :
                        <div className="container">
                            <h2>Sign In</h2>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <lablel>Name:</lablel>
                                    <br/>
                                    <input name="username" ref={register({ required: {value: true, message: "Must input name"} })} />
                                    {errors.username && errors.username.type === "required" && (
                                        <div className="error text-danger">{errors.username.message}</div>
                                    )}
                                </div>
                                {/*
                                <div className="form-group">
                                    <label>Email:</label>
                                    <br/>
                                    <input name="email" ref={register} />
                                </div>
                                */}
                                <div className="form-group">
                                    <label>Password:</label>
                                    <br/>
                                    <input name="password" type="password" ref={register({ required: {value: true, message: "Must input password"} })} />
                                    {errors.password && errors.password.type === "required" && (
                                        <div className="error text-danger">{errors.password.message}</div>
                                    )}
                                </div>
                                <input type="submit" className="btn btn-primary" />
                            </form>
                            <br/>
                            <AuthorsList />
                        </div>
            }
        </div>
    );
}