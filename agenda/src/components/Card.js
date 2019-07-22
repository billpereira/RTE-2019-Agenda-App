import React from 'react';
import Time from './Time';

const Card = ({ cardActive, cardInfo }) => {
	return (
		<>
			<div 
      className={
        cardActive 
        ? 'session-card card-active' 
        : 'session-card'
        }
      >
				<p>{cardInfo.name}</p>
				<Time isActive={cardActive} sessionTime={cardInfo.time}/>
			</div>
		</>
	);
};

export default Card;
