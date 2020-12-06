import React, { useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { logout } from '../services/accountService';
import { findBooksByTitle } from '../services/bookService';
import '../styles/header.scss';
import Modal from 'react-modal';
import { analyticalJob } from '../services/analyticalService';

const customStyles = {
    content : {
      top                   : '30%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

Modal.setAppElement('#root');

export default function Header() {
    const [user, setUser] = useState('Sign In');
    const [modalIsOpen,setIsOpen] = useState(false);
    const [analyseButtonText, setAnalyseButtonText] = useState("Start Analyse");
    const [loggedIn, setLoggedIn] = useState(false);
    const [modalMessage, setModalMessage] = useState('Nothing\'s going on right now');
    const [pearsonCorrelation, setPearsonCorrelation] = useState(0);
    const { register, handleSubmit } = useForm();
    const history =  useHistory();
    const location = useLocation();

    useEffect(() => {
        if (localStorage.getItem('account')) {
            const userData = JSON.parse(localStorage.getItem('account'));
            const username = userData.username
            setUser(username);
            setLoggedIn(true);
        }
    }, [])

    const startAnalyticalJob = async () => {
        setAnalyseButtonText("Performing Analytical Job...");
        try {
            const response = await analyticalJob();
            if (response.status === 200) {
                setPearsonCorrelation(response.data);
                setModalMessage("Pearson correlation between price and average review length is :");
            }
        } catch(err) {
            console.log(err);
            setModalMessage("Something went wrong while performing the analytical job, please try again later");
        } finally {
            setIsOpen(true);
            setAnalyseButtonText("Start Analyse");
        }
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const signOut = () => {
        if (logout()) {
            setLoggedIn(false);
            history.push('/');
            history.go(0);
        }
    }

    const searchBook = async (data) => {
        if (data.search === "") {
            history.push({pathname: "/search-result", state: { found: false }});
            return;
        }
        try {
            const response = await findBooksByTitle(data.search);
            if (response.status === 200) {
                if (Object.keys(response.data).length === 0) {
                    history.push({pathname: "/search-result", state: { found: false }});
                } else {
                    history.push({pathname: "/search-result", state: { detail: response.data, found: true }});
                }
            }
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="container header-area">
            <nav className="navbar navbar-expand navbar-light" style={{backgroundColor: "white"}}>
                <h1><Link to="/" onClick={() => { if (location.pathname === '/') history.go(0)}}>Books Heaven</Link></h1>
                <ul className="nav navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={() => { if (location.pathname === '/') history.go(0)}}><i className="fa far">&#xf015;</i> Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/new-book" className="nav-link"><i className="fa far">&#xf02d;</i> New Book</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/new-review" className="nav-link"><i className="fa far">&#xf075;</i> New Review</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link"><i className="fa far">&#xf007;</i> {user}</Link>
                    </li>
                    { loggedIn ? 
                        <li className="nav-item">
                            <button onClick={signOut} className="btn btn-secondary">Logout</button>
                        </li>
                        :
                        <li className="nav-item">
                            <Link to="/sign-up" className="nav-link"><i className="fa far">&#xf007;</i> Sign Up</Link>
                        </li>
                    }
                    <li className="nav-item">
                        <Link to="#" className="nav-link" onClick={startAnalyticalJob}><i className="fa">&#xf080;</i> {analyseButtonText}</Link>
                    </li>
                </ul>
            </nav>
            <form onSubmit={handleSubmit(searchBook)}>
                <input name="search" ref={register} onSubmit={handleSubmit(searchBook)} placeholder="&#xf002; Book's Title" className="fontAwesome search-bar" />
                <input type="submit" style={{visibility: "hidden"}} className="submit-key" />
            </form>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div className="container">
                    <h2>{modalMessage}</h2>
                    { pearsonCorrelation !== 0 ? 
                        <p style={{textAlign: "center"}}>{pearsonCorrelation}</p>
                        :
                        <></>
                     }
                    <button onClick={closeModal} className="btn btn-primary" style={{marginLeft: "50%"}}>Close</button>
                </div>
            </Modal>
        </div>
    )
}