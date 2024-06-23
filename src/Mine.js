import React, { useState } from 'react';
import './Mine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faClock, faLevelUpAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Mine = ({ points, quests, onQuestPurchase, hourlyIncome }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="mine-page">
      <div className="points-display">
        <div className="points-info">
          <img src="coin.png" alt="points icon" className="points-icon" />
          <span className="points-text">{points}</span>
        </div>
        <div className="hourly-income">
          <FontAwesomeIcon icon={faExclamationCircle} className="info-icon" onClick={handleTooltipToggle} />
          {showTooltip && (
            <div className="info-tooltip">
              Current hourly income: {hourlyIncome}
            </div>
          )}
        </div>
      </div>
      <div className="quests-container">
        {quests.map(quest => (
          <div key={quest.id} className="quest-block" onClick={() => onQuestPurchase(quest.id)}>
            <div className="quest-icon-wrapper">
              <FontAwesomeIcon icon={quest.icon} className="quest-icon" />
            </div>
            <div className="quest-title">{quest.title}</div>
            <div className="quest-details">
              <FontAwesomeIcon icon={faClock} className="quest-icon" />
              Profit per hour: {quest.income}
            </div>
            <div className="quest-details">
              <FontAwesomeIcon icon={faLevelUpAlt} className="quest-icon" />
              Level: {quest.level}
            </div>
            <div className="quest-details">
              <FontAwesomeIcon icon={faCoins} className="quest-icon" />
              Cost: {quest.cost}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mine;
