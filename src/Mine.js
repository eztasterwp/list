import React, { useState } from 'react';
import './Mine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faClock, faLevelUpAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

// Динамический импорт изображений
const questsData = [
  { id: 1, title: 'Купить удобрения', income: 5, level: 0, cost: 10, icon: faCoins, image: require('./images/fertilizer.png') },
  { id: 2, title: 'Купить грунт', income: 10, level: 0, cost: 20, icon: faCoins, image: require('./images/soil.png') },
  { id: 3, title: 'Купить семена', income: 15, level: 0, cost: 30, icon: faCoins, image: require('./images/seeds.webp') },
  { id: 4, title: 'Заплатить налоги', income: 20, level: 0, cost: 40, icon: faCoins, image: require('./images/taxes.png') },
  { id: 5, title: 'Отправить товар в CoffeeShop', income: 25, level: 0, cost: 50, icon: faCoins, image: require('./images/delivery.png') },
  { id: 6, title: 'Купить лицензию', income: 30, level: 0, cost: 60, icon: faCoins, image: require('./images/license.png') },
];

const Mine = ({ points, quests = questsData, onQuestPurchase, hourlyIncome }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);
  };

  const handleQuestClick = (quest) => {
    setSelectedQuest(quest);
  };

  const handleConfirmPurchase = () => {
    onQuestPurchase(selectedQuest.id);
    setSelectedQuest(null);
  };

  const handleCancelPurchase = () => {
    setSelectedQuest(null);
  };

  return (
    <div className="mine-page">
      <div className="points-display">
        <div className="points-info">
          <img src="/images/coin.png" alt="points icon" className="points-icon" />
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
          <div key={quest.id} className="quest-block" onClick={() => handleQuestClick(quest)}>
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
            <img src={quest.image.default} alt={quest.title} className="quest-image" />
          </div>
        ))}
      </div>

      {selectedQuest && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Purchase</h2>
            <p>Are you sure you want to buy <strong>{selectedQuest.title}</strong> for <strong>{selectedQuest.cost}</strong> coins?</p>
            <div className="modal-buttons">
              <button className="modal-button confirm" onClick={handleConfirmPurchase}>Yes</button>
              <button className="modal-button cancel" onClick={handleCancelPurchase}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mine;
