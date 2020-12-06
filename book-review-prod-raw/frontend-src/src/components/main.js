import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './home';
import NewBook from './book/newBook';
import NewReview from './review/newReview';
import Login from './account/login';
import SignUp from './account/signUp';
import Reviews from './review/reviews';
import SearchResult from './searchResult';

export default function Main() {
    return (
        <main>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/new-book" component={NewBook} />
                <Route path="/new-review" component={NewReview} />
                <Route path="/login" component={Login} />
                <Route path="/sign-up" component={SignUp} />
                <Route path="/reviews" component={Reviews} />
                <Route path="/search-result" component={SearchResult} />
            </Switch>
        </main>
    )
}