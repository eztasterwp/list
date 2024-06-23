import React from 'react';
import './Community.css';

import telegramIcon from './images/telegram.png';
import xIcon from './images/twitter.png';
import hamsterIcon from './images/cannabis.png';
import inviteIcon from './images/invitetg.png';

const Friends = () => {
  return (
    <div className="community-page">
      <div className="referral-section">
        <p>Ваша реферальная ссылка:</p>
        <div className="referral-link">https://example.com/referral-link</div>
      </div>
      <div className="earnings-section">
        <p>Заработано с рефералов:</p>
        <span className="earnings">0 очков</span>
      </div>
      <div className="tasks-section">
        <h3>Список заданий</h3>
        <div className="task">
          <img src={telegramIcon} alt="Telegram" className="task-icon" />
          <div className="task-text">
            <span>Присоединяйся к нашему Telegram каналу</span>
          </div>
          <span className="task-reward">+5000</span>
        </div>
        <div className="task">
          <img src={xIcon} alt="X" className="task-icon" />
          <div className="task-text">
            <span>Следи за нашим аккаунтом в X</span>
          </div>
          <span className="task-reward">+5000</span>
        </div>
        <div className="task">
          <img src={hamsterIcon} alt="Hamster" className="task-icon" />
          <div className="task-text">
            <span>Выбери биржу</span>
          </div>
          <span className="task-reward">+5000</span>
        </div>
        <div className="task">
          <img src={inviteIcon} alt="Invite" className="task-icon" />
          <div className="task-text">
            <span>Пригласи 3 друзей</span>
          </div>
          <span className="task-reward">+25000</span>
        </div>
      </div>
      <div className="leaderboard-section">
        <button className="leaderboard-button">Leaderboard</button>
      </div>
    </div>
  );
};

export default Friends;
