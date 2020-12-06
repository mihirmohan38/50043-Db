import React from 'react';
import { useForm } from 'react-hook-form';
import { signUp } from '../../services/accountService';
import { useHistory } from 'react-router-dom';

export default function SignUp() {
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();

    const onSubmit = async (data) => {
        try {
            const user = await signUp(data);
            if (user.status === 200) {
                alert(`${user.data.message}`)
                history.push('/login');
            }
        } catch(err) {
            console.log(err);
            alert("Sign up failed, please try again");
        } finally {
            history.go(0);
        }
    }
    
    return (
        <div className="container">
            <h2>Sign Up To Share Your Love For Book With Millions of User Today!</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Name:</label>
                    <br/>
                    <input name="username" ref={register({ required: { value: true, message: "Must input name" }})} />
                    {errors.username && errors.username.type === "required" && (
                        <div className="error text-danger">{errors.username.message}</div>
                    )}
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <br/>
                    <input name="email" ref={register({ required: { value: true, message: "Must input email" } })} />
                    {errors.email && errors.email.type === "required" && (
                        <div className="error text-danger">{errors.email.message}</div>
                    )}
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <br/>
                    <input name="password" type="password" ref={register({ required: { value: true, message: "Must input password" }, minLength: {value: 8, message: "Password must has a length of minimum 8"}})} />
                    {errors.password && errors.password.type === "required" && (
                        <div className="error text-danger">{errors.password.message}</div>
                    )}
                    {errors.password && errors.password.type === "minLength" && (
                        <div className="error text-danger">{errors.password.message}</div>
                    )}
                </div>
                <input type="submit" className="btn btn-primary" />
            </form>
        </div>
    );
}