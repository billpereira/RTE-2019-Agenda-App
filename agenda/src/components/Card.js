import React from 'react';
import Time from './Time';

const Card = ({ cardActive, cardInfo, hide }) => {
	return (
		<>
			<div 
      className={
        cardActive 
        ? 'session-card card-active' 
        : (hide?'blank-card':'session-card')
        }
      >
				<p>{cardInfo.name}</p>
				<Time isActive={cardActive} sessionTime={cardInfo.time} hide={hide}/>
			</div>
		</>
	);
};

export default Card;
