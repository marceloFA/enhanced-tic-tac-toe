import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// A simplified Square component
function Square(props){
	return(
		<button className="square" onClick={props.onClick}>
		{props.value}
		</button>
	);
}


class Board extends React.Component{

	renderSquare(i){
		return(
			<Square 
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render(){
		return(
			<div>

				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>

				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>

				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>

			</div>
		);
	}
}

class Game extends React.Component {
	
	constructor(props){
		super(props);

		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					moveIndexes: {row:null, column:null},
				}
			],
			stepNumber:0,
			xIsNext: true
		};
	}

	handleClick(i){
		const history = this.state.history.slice(0, this.state.stepNumber +1);
		const current = history[history.length -1];
		const squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = this.getSquareMark();

		const moveIndexes = this.getMoveIndexes(i);

		this.setState(
			{
				history: history.concat([{squares:squares, moveIndexes:moveIndexes}]),
				stepNumber : history.length,
				// make current move line bold
				xIsNext: !this.state.xIsNext
			}
		);
	}

	jumpTo(step){
		this.setState(
			{
				stepNumber:step,
				xIsNext: (step % 2) === 0
			}
		);
	}

	getSquareMark(){
		return this.state.xIsNext ? "X" : "O";
	}

	getMoveIndexes(i){
		i += 1;
		var row, col;
		if (i<7){

			if(i<4){
				row = 1;
				col = i;
			}
			else{
				row = 2;
				col = i-3;
			};
		}
		else{
			row = 3;
			col = i-6;
		};

		return {row:row, column:col};
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) =>
			{
				const row = history[move].moveIndexes.row;
				const column = history[move].moveIndexes.column;
				const description = move ? 
				`Move #${move}: ${move % 2 === 1? "X" : "O"} on row ${row} column ${column}` : 
				'Game start';
				const currentStep = this.state.stepNumber === move;

				if(currentStep){
					return(
						<li key={move}>
							
								<button onClick={() => this.jumpTo(move)}>
									<strong>
										{description}
									</strong>
								</button>
						</li>
					)
				}
				else{
					return (
						<li key={move}>
							<button onClick={() => this.jumpTo(move)}>
								{description}
							</button>
						</li>
					);
				}
			}
				
		);

		let status;
		if (winner) {
			status = "Winner: " + winner;
		}
		else{
			status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
		};

		return(
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}


ReactDOM.render(<Game />, document.getElementById("root"));

// Auxiliar functions

function calculateWinner(squares){
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]
	];

	for (let i=0; i<lines.length; i++){
		const [a,b,c] = lines[i];
		if (squares[a] &&
		 	squares[a] === squares[b] &&
		 	squares[a] === squares[c]){

			return squares[a];
		};
	}

	return null;
}



























