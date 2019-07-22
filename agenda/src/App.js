import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import sampleSessions from './data/sampleSessions';
import './scss/App.scss';
import SelectBox from './components/SelectBox';
import Card from './components/Card';

function App() {
	const [room, setRoom] = useState('0');
	const [dataToDisplay, setDataToDisplay] = useState([]);
	const [tableState, setTableState] = useState({
		0: { prev: 0, active: 1, next: 2 },
		1: { prev: 0, active: 1, next: 2 }
	});

	useEffect(() => {
		setDataToDisplay(sampleSessions.filter(item => item.room === room));
	}, [room]);

	const handleTransition = n => {
		let { prev, active, next } = tableState[room];
		prev = prev + n;
		active = active + n;
		next = next + n;

		if (prev < 0) prev = dataToDisplay.length + prev;
		if (active < 0) active = dataToDisplay.length + active;
		if (next < 0) next = dataToDisplay.length + next;
		if (prev >= dataToDisplay.length) prev = prev - dataToDisplay.length;
		if (active >= dataToDisplay.length) active = active - dataToDisplay.length;
		if (next >= dataToDisplay.length) next = next - dataToDisplay.length;

		setTableState({ ...tableState, [room]: { prev, active, next } });
	};

	return (
		<div className="App">
			<SelectBox roomSelected={room} changeRoom={setRoom} />
			{dataToDisplay.length > 0 ? (
				<button
					onClick={() => handleTransition(-1)}
					disabled={
						tableState[room].prev===dataToDisplay.length - 1
					}
					className={
						tableState[room].prev===dataToDisplay.length - 1 ? 'disabled-button' : ''
					}
				>
					<FontAwesomeIcon icon={faChevronUp} />
				</button>
			) : null}
			{dataToDisplay[tableState[room].prev] && (
				<>
					<Card
						cardActive={false}
						cardInfo={dataToDisplay[tableState[room].prev]}
						hide={tableState[room].prev===dataToDisplay.length-1}
					/>
					<Card
						cardActive={true}
						cardInfo={dataToDisplay[tableState[room].active]}
					/>
					<Card
						cardActive={false}
						cardInfo={dataToDisplay[tableState[room].next]}
						hide={tableState[room].next===0}
					/>
				</>
			)}
			{
				dataToDisplay.length > 0 ? (
				<button
					onClick={() => handleTransition(1)}
					disabled={tableState[room].next===0}
					className={
						tableState[room].next===0 ? 'disabled-button' : ''
					}
				>
					<FontAwesomeIcon icon={faChevronDown} />
				</button>
			) : null}
		</div>
	);
}

export default App;
