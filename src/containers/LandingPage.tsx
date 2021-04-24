import React from 'react'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Firebase from "../service/Firebase";
import Button from "react-bootstrap/Button";
import {RouteComponentProps, withRouter} from 'react-router-dom';
// @ts-ignore
import logo from '../logo.svg';
// @ts-ignore
import headerImg from '../img/retro-board-lp-header.svg';
// @ts-ignore
import retroBoardImg from '../img/retro-board-design.png';
// @ts-ignore
import retroBoardDashboardImg from '../img/retro-board-dashboard.png';
// @ts-ignore
import retroBoardTemplateImg from '../img/retro-board-create-template.png';
import PageFooter from "../components/smart/PageFooter";
import {Image} from "react-bootstrap";
import './style.css';


interface Props extends RouteComponentProps {
    success: () => void
}

const LandingPage: React.FunctionComponent<Props> = (props: Props) => {
    const getReferrerUrl = () => {
        if (props.location.state) {
            return (props.location.state as { referrer: string }).referrer
        }
        return "/"
    }

    const tryGoogleLogin = () =>
    {
        let firebase = Firebase.getInstance();
        firebase.isUserAuthenticated()
            .then(isAuth => {
                if (!isAuth) {
                    firebase.authenticateUser().then(() => {
                        props.success()
                        props.history.push(getReferrerUrl())
                    })
                }
            });
    }

    const tryAnonymousLogin = async () =>
    {
        let firebase = Firebase.getInstance();
        if (!await firebase.isUserAuthenticated()) {
            firebase.authenticateAnonymousUser().then(() => {
                console.log(props.location.state)
                props.success()
                props.history.push(getReferrerUrl())
            })
        }
    }
    return <>
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand" href="#">
                <img src={logo} width="30" height="30"
                     className="d-inline-block align-top" alt=""/>
                Designer Boards
            </a>
        </nav>
        <Container fluid={true} className={"d-flex w-100 h-100 p-3 mx-auto flex-column"}>
            <section className={"login-section"}>
                <Container>
                    <Row className={"align-items-center justify-content-center"}>
                        <Col>
                            <div className={"pt-3"}>
                                <h2>Get Started!</h2>
                                <p style={{textAlign: "center"}}>It doesn't need a manual.</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button className="btn btn-block btn-social btn-google" onClick={tryGoogleLogin}>
                                <span className="fa fa-google"></span>
                                Sign in with Google
                            </Button>
                        </Col>
                        <Col>
                            <Button className="btn btn-block btn-social" onClick={tryAnonymousLogin}>
                                <span className="fa fa-user"></span>
                                Sign in as Anonymous User
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#0099ff" fill-opacity="1"
                          d="M0,256L80,213.3C160,171,320,85,480,85.3C640,85,800,171,960,213.3C1120,256,1280,256,1360,256L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </section>
            <header>
                <Container>
                    <Row className={"justify-content-center align-items-center"}>
                        <Col>
                            <div className={"pt-3"}>
                                <h3>Build Dynamic Beautiful Boards</h3>
                                <p>
                                    You often find yourself working on
                                    the excel sheet and then sharing it with the group.
                                    Well, no need for that anymore.
                                    You can use this platform to quickly create beautiful
                                    looking boards for your teams to work together.
                                </p>
                            </div>

                        </Col>
                        <Col>
                            <div className="pt-3">
                                <Image src={headerImg} alt={"Designer Boards"}/>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </header>
            <section className={"features"}>
                <Container>
                    <Row>
                        <Col>
                            <h1 style={{borderBottom: "2px solid black"}}>Features</h1>
                        </Col>
                    </Row>
                    <Row className={"justify-content-center align-items-center p-3"}>
                        <Col>
                            <Image src={retroBoardImg} className={"img-fluid"}/>
                        </Col>
                        <Col>
                            <h3>In-built Retro Board Template</h3>
                            <p>
                                Get started with your team's retrospective meetings
                                in less than a minute. It comes with the pre-build
                                template to get you started quickly.
                            </p>
                        </Col>
                    </Row>
                    <Row className={"justify-content-center align-items-center p-3"}>
                        <Col>
                            <h3>Create Your Own Colorful Templates</h3>
                            <p>
                                Don't worry if pre-built templates doesn't serve your purpose.
                                You can create your colorful templates with a very simple interface.
                            </p>
                        </Col>
                        <Col>
                            <Image src={retroBoardTemplateImg} className={"img-fluid"}/>
                        </Col>
                    </Row>
                    <Row className={"justify-content-center align-items-center p-3"}>
                        <Col>
                            <Image src={retroBoardDashboardImg} className={"img-fluid"}/>
                        </Col>
                        <Col>
                            <h3>Dashboard To Manage All Your Boards</h3>
                            <p>
                                Having a lot of boards can be challenging to keep track of.
                                That's why it comes with your own dashboard so that you can
                                find all your dashboards in one place.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
            <PageFooter/>
        </Container>
    </>
}

export default withRouter(LandingPage)