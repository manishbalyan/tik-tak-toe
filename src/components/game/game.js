import React, { Component } from 'react';
import Board from "../board/board";
import './game.css'


class Game extends Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            lastFiveMatch:[],
            isFinished:false
        };
        this.startNewGame = this.startNewGame.bind(this)
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,

        });
    }
     calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }

    }
    let checkNull;
    checkNull = squares.every((square)=>{
        return square!==null;

    })
         if(checkNull){
        return 'Match draw'
         }

    return null;
}
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    startNewGame(finished,copyMatchResult){
        this.setState({
            isFinished:!finished,
            lastFiveMatch:copyMatchResult,
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,

        })

    }


    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        let finished = this.state.isFinished;
        const winner = this.calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Move #' + move :
                'Game start';
            return (
                <li key={move}>
                    <a onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

        let status;
        let copyMatchResult = this.state.lastFiveMatch;

        if (winner && !finished) {
            if(winner==='Match draw'){
                status =  winner;
            }
            else{
                status = 'Winner: ' + winner;

            }
            if(copyMatchResult.length<5){
                copyMatchResult.push(status)
            }
            else{
                copyMatchResult.splice(0,1);
                copyMatchResult.push(status)
            }
            // this.setState({
            //     lastFiveMatch: copyMatchResult
            // })
            console.log(copyMatchResult,"cpm")
            finished = !finished




        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (

            <div className="game">
                <div>
                    <p className="record_matches">Last five matches result</p>
                    <ol>
                        {copyMatchResult.map((match,i)=>(
                            <li key={i}>{match}</li>
                        ))}

                    </ol>


                </div>

                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status_game">{status}</div>
                    {finished && <button onClick={()=>this.startNewGame(finished,copyMatchResult)}>Next Game</button>}
                    {/*<ol>{moves}</ol>*/}
                </div>

            </div>
        );
    }
}

export default Game;
