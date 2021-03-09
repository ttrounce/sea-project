import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import quizStyles from '../../styles/quiz.module.css'
import Navbar from '../../components/Navbar/Navbar'
import { useSession } from 'next-auth/client'
import { useState } from 'react'

export default function Wellbeing() {
    const [session, loading] = useSession()
    if (loading) {
        return <></>
    }

    /**Below are the set of questions, and their corresponding answers, with the related health score, for the well-being
     * assessment
     */
    const questions = [
        {
            questionText:
                "Recently, I've been feeling optimistic about the future",
            answerOptions: [
                { answerText: 'None of the time', healthPoints: 0 },
                { answerText: 'Rarely', healthPoints: 1 },
                { answerText: 'Some of the time', healthPoints: 2 },
                { answerText: 'Often', healthPoints: 3 },
                { answerText: 'All of the time', healthPoints: 4 }
            ]
        },
        {
            questionText: "Recently, I've been feeling useful",
            answerOptions: [
                { answerText: 'None of the time', healthPoints: 0 },
                { answerText: 'Rarely', healthPoints: 1 },
                { answerText: 'Some of the time', healthPoints: 2 },
                { answerText: 'Often', healthPoints: 3 },
                { answerText: 'All of the time', healthPoints: 4 }
            ]
        },
        {
            questionText: 'I feel interested in my work and studies',
            answerOptions: [
                { answerText: 'None of the time', healthPoints: 0 },
                { answerText: 'Rarely', healthPoints: 1 },
                { answerText: 'Some of the time', healthPoints: 2 },
                { answerText: 'Often', healthPoints: 3 },
                { answerText: 'All of the time', healthPoints: 4 }
            ]
        },
        {
            questionText: 'I have been dealing with my problems well',
            answerOptions: [
                { answerText: 'None of the time', healthPoints: 0 },
                { answerText: 'Rarely', healthPoints: 1 },
                { answerText: 'Some of the time', healthPoints: 2 },
                { answerText: 'Often', healthPoints: 3 },
                { answerText: 'All of the time', healthPoints: 4 }
            ]
        },
        {
            questionText: 'I have been feeling interested in other people',
            answerOptions: [
                { answerText: 'None of the time', healthPoints: 0 },
                { answerText: 'Rarely', healthPoints: 1 },
                { answerText: 'Some of the time', healthPoints: 2 },
                { answerText: 'Often', healthPoints: 3 },
                { answerText: 'All of the time', healthPoints: 4 }
            ]
        },
        {
            questionText:
                'I have been looking after my physical health (exercise, healthy eating)',
            answerOptions: [
                { answerText: 'None of the time', healthPoints: 0 },
                { answerText: 'Rarely', healthPoints: 1 },
                { answerText: 'Some of the time', healthPoints: 2 },
                { answerText: 'Often', healthPoints: 3 },
                { answerText: 'All of the time', healthPoints: 4 }
            ]
        },
        {
            questionText: 'I feel energetic on a day to day basis',
            answerOptions: [
                { answerText: 'None of the time', healthPoints: 0 },
                { answerText: 'Rarely', healthPoints: 1 },
                { answerText: 'Some of the time', healthPoints: 2 },
                { answerText: 'Often', healthPoints: 3 },
                { answerText: 'All of the time', healthPoints: 4 }
            ]
        },
        {
            questionText: "I've been thinking clearly",
            answerOptions: [
                { answerText: 'None of the time', healthPoints: 0 },
                { answerText: 'Rarely', healthPoints: 1 },
                { answerText: 'Some of the time', healthPoints: 2 },
                { answerText: 'Often', healthPoints: 3 },
                { answerText: 'All of the time', healthPoints: 4 }
            ]
        },
        {
            questionText: 'I have been feeling close to others',
            answerOptions: [
                { answerText: 'None of the time', healthPoints: 0 },
                { answerText: 'Rarely', healthPoints: 1 },
                { answerText: 'Some of the time', healthPoints: 2 },
                { answerText: 'Often', healthPoints: 3 },
                { answerText: 'All of the time', healthPoints: 4 }
            ]
        }
    ]

    // Getter and Setter methods
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [showScore, setShowScore] = useState(false)
    const [score, setScore] = useState(0)

    const handleAnswerOptionClick = (healthPoints) => {
        if (healthPoints === 0) {
            setScore(score + 0)
        } else if (healthPoints === 1) {
            setScore(score + 1)
        } else if (healthPoints === 2) {
            setScore(score + 2)
        } else if (healthPoints === 3) {
            setScore(score + 3)
        } else if (healthPoints === 4) {
            setScore(score + 4)
        }

        const nextQuestion = currentQuestion + 1

        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion)
        } else {
            setShowScore(true)
        }
    }

    // Returns a well-being message dependent on the value of score, forumlated from the users answers.
    const getScoreDescription = (score_) => {
        if (score_ < 15) {
            return (
                <div>
                    <h4>
                        Your well-being score implies to us that you may be
                        having a hard time, please reach out and get in touch.
                        Here are some support helplines to start with:
                    </h4>
                    <li>Student Support Exeter - 01392 263018</li>
                    <li>
                        Mind UK (confidential mental health support) - 0300 123
                        3393
                    </li>
                </div>
            )
        } else if (score >= 15 && score < 25) {
            return (
                <div>
                    <h4>
                        Your well-being score implies to us that you are doing
                        okay, but may need some help.
                    </h4>
                    <br></br> Please consider getting in touch with your
                    personal tutor.
                </div>
            )
        } else {
            return (
                <div>
                    Your score indicates that you are doing ok! Please continue
                    to stay on-top of your well-being and know we are here to
                    help. <br></br>For more information, visit The University of
                    Exeter website.
                </div>
            )
        }
    }
    return (
        <>
            <div className={styles.riverBackground} />
            <div className={styles.container}>
                <Head>
                    <title>Campus Connect</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <>
                    {!session && (
                        <>
                            <Navbar
                                content={[
                                    { title: 'Posts', url: '/posts' },
                                    { title: 'Groups', url: '/groups' },
                                    { title: 'Log In', url: '/login' },
                                    { title: 'Register', url: '/register' }
                                ]}
                            />
                        </>
                    )}
                    {session && (
                        <>
                            <Navbar
                                content={[
                                    { title: 'Posts', url: '/posts' },
                                    { title: 'Groups', url: '/groups' },
                                    { title: 'My Account', url: '/profile' }
                                ]}
                            />
                        </>
                    )}
                </>
                <main className={styles.main}>
                    <h1 className={styles.title}>
                        {' '}
                        <a href={'/'}>Campus Connect Wellbeing</a>
                    </h1>

                    <p className={styles.description}>
                        Take a confidential well-being assessment, none of this
                        data is saved.
                    </p>

                    <div className={quizStyles.card}>
                        <div className={'wellbeing'}>
                            <div className="question-section">
                                <div className={quizStyles.questionNum}>
                                    <span>Question {currentQuestion + 1}</span>/
                                    {questions.length}
                                </div>
                                <div className={quizStyles.question}>
                                    {questions[currentQuestion].questionText}
                                </div>
                            </div>
                            <div className="answers">
                                {
                                    // Create a new array populated with the results of calling answerBtn on every element in the calling array
                                    questions[
                                        currentQuestion
                                    ].answerOptions.map((answer) => (
                                        <button
                                            className={quizStyles.answerBtn}
                                            onClick={() => {
                                                handleAnswerOptionClick(
                                                    answer.healthPoints
                                                )
                                            }}>
                                            {answer.answerText}
                                        </button>
                                    ))
                                }
                                <br></br>
                                {
                                    // Display the score description, dependent on score.
                                    showScore ? (
                                        <p className={quizStyles.question}>
                                            {' '}
                                            {getScoreDescription(score)}{' '}
                                        </p>
                                    ) : (
                                        <> </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </main>

                <footer className={styles.footer}>
                    Programmed by Brian Evans, Adam Tweedie, Alex Rundle, Toby
                    Trounce and Matthew Hudson
                </footer>
            </div>
        </>
    )
}
