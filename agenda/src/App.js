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

	useEffect(() => {
		setDataToDisplay(sampleSessions.filter(item => item.room === room));
	}, [room]);

	useEffect(()=>{
		console.log(dataToDisplay)
	},[dataToDisplay])

	const handleUp = () => {
		let flag = false;
		setDataToDisplay(
			dataToDisplay.map(item => {
				switch (item.display) {
					case 'active':
						item.display = 'prev';
						break;

					case 'prev':
						item.display = null;
						break;

					case 'next':
						item.display = 'active';
						flag = true;
						break;

					default:
						if (flag) {
							item.display = 'next';
							flag = false;
						} else item.display = null;
						break;
				}
				return item;
			})
		);
	};
	const handleDown = () => {
		// let flag = false;
		setDataToDisplay(
			dataToDisplay.map(item => {
				switch (item.display) {
					case 'active':
						item.display = 'next';
						break;

					case 'next':
						item.display = null;
						break;
					case 'prev':
						item.display = 'active';
						// flag = true;
						break;

					default:
						if(dataToDisplay[item.id+1]) if(dataToDisplay[item.id+1].display==='prev'){
								item.display = 'prev';
						} else item.display = null;
						break;
				}
				return item;
			})
		);
	};

	return (
		<div className="App">
			<SelectBox roomSelected={room} changeRoom={setRoom} />
			{dataToDisplay.length > 0 ? (
				<button
					onClick={() => handleUp()}
					disabled={
						dataToDisplay[dataToDisplay.length - 1].display === 'active'
					}
				>
					<FontAwesomeIcon icon={faChevronUp} />
				</button>
			) : null}
			{dataToDisplay.map(card =>
				card.display === 'prev' ||
				card.display === 'active' ||
				card.display === 'next' ? (
					card.display === 'active' ? (
						<Card cardActive={true} cardInfo={card} key={card.id} />
					) : (
						<Card cardActive={false} cardInfo={card} key={card.id} />
					)
				) : null
			)}
			{dataToDisplay.length > 0 ? (
				<button
					onClick={() => handleDown()}
					disabled={dataToDisplay[0].display === 'active'}
				>
					<FontAwesomeIcon icon={faChevronDown} />
				</button>
			) : null}
		</div>
	);
}

export default App;
