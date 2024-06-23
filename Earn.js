import React, { useState, useEffect } from 'react';
import './Earn.css';
import chester from './images/chester.png';
import chester1 from './images/chester-1.png';
import chester2 from './images/chester-2.png';
import chester3 from './images/chester-3.png';
import chester4 from './images/chester-4.png';
import kiza from './images/kiza.png';
import Notification from './Notification';

const caseData = [
  { id: 1, name: 'Chester', image: chester, cost: 500 },
  { id: 2, name: 'Chester 1', image: chester1, cost: 1000 },
  { id: 3, name: 'Chester 2', image: chester2, cost: 1500 },
  { id: 4, name: 'Chester 3', image: chester3, cost: 2000 },
  { id: 5, name: 'Chester 4', image: chester4, cost: 2500 },
];

const Earn = ({ setShowBossBattle, points, setPoints, setTotalPoints }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [showBattle, setShowBattle] = useState(false);
  const [battleClicks, setBattleClicks] = useState(0);
  const [battleTime, setBattleTime] = useState(60); // 60 seconds for battle
  const [messages, setMessages] = useState([]); // Состояние для сообщений
  const [caseCooldowns, setCaseCooldowns] = useState({}); // Состояние для отслеживания кулдаунов сундуков
  const [coins, setCoins] = useState([]); // Состояние для анимации монет
  const [notification, setNotification] = useState(null); // Состояние для уведомлений

  useEffect(() => {
    const interval = setInterval(() => {
      setCaseCooldowns(prevCooldowns => {
        const updatedCooldowns = {};
        Object.keys(prevCooldowns).forEach(caseId => {
          const timeLeft = prevCooldowns[caseId] - 1000;
          if (timeLeft > 0) {
            updatedCooldowns[caseId] = timeLeft;
          }
        });
        return updatedCooldowns;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (showBattle) {
      timer = setInterval(() => {
        setBattleTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endBattle(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showBattle]);

  useEffect(() => {
    if (selectedCase && battleClicks >= selectedCase.cost / 2) {
      endBattle(true); // Завершить битву, как только условие будет выполнено
    }
  }, [battleClicks, selectedCase]);

  const handleCaseClick = (caseItem) => {
    const cooldown = caseCooldowns[caseItem.id];
    if (cooldown > 0) {
      alert(`Этот сундук будет доступен через ${Math.ceil(cooldown / 3600000)} часов.`);
      return;
    }
    if (points < caseItem.cost) {
      alert('Недостаточно очков для участия в битве!');
      return;
    }
    setSelectedCase(caseItem);
  };

  const handleCloseCase = () => {
    setSelectedCase(null);
  };

  const startBattle = () => {
    setPoints(points - selectedCase.cost); // Снимаем очки за участие
    setShowBattle(true);
    setBattleClicks(0);
    setBattleTime(60);
    setShowBossBattle(true); // Предотвращаем закрытие страницы
    console.log('Battle started');
  };

  const handleKizaClick = (event) => {
    setBattleClicks(battleClicks + 1);

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const newMessage = {
      id: Date.now(),
      text: `💨`,
      x: touchX,
      y: touchY
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    setTimeout(() => {
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== newMessage.id)
      );
    }, 2000);
  };

  const endBattle = (won) => {
    setShowBattle(false);
    setShowBossBattle(false); // Разрешаем закрытие страницы
    if (won) {
      const earnedPoints = selectedCase.cost * 2;
      setNotification(`You won the battle! You earned ${earnedPoints} points!`);
      animateCoins(earnedPoints); // Анимация монет при победе
      console.log(`Battle won, earned ${earnedPoints} points`);
    } else {
      setNotification('You lost the battle!');
      console.log('Battle lost');
    }
    setCaseCooldowns(prevCooldowns => {
      const updatedCooldowns = {
        ...prevCooldowns,
        [selectedCase.id]: 24 * 3600000 // Устанавливаем кулдаун на 24 часа
      };
      return updatedCooldowns;
    });
    setSelectedCase(null);
  };

  const handleCloseBattle = () => {
    endBattle(false);
  };

  const animateCoins = (earnedPoints) => {
    const newCoins = [];
    for (let i = 0; i < earnedPoints / 50; i++) {
      newCoins.push({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      });
    }
    setCoins(newCoins);
    setTimeout(() => {
      setCoins([]);
      setPoints(points + earnedPoints);
      setTotalPoints(totalPoints => totalPoints + earnedPoints);
    }, 2000);
  };

  return (
    <div className="earn-page">
      <div className="earn-header">
        <h2>Испытай удачу в битве за золото!</h2>
      </div>
      <div className="case-container-wrapper">
        <div className="case-container">
          {caseData.map((caseItem) => (
            <div
              key={caseItem.id}
              className={`case ${caseCooldowns[caseItem.id] ? 'case-cooldown' : ''}`}
              style={{ backgroundImage: `url(${caseItem.image})` }}
              onClick={() => handleCaseClick(caseItem)}
            >
              {caseCooldowns[caseItem.id] && (
                <div className="cooldown-timer">
                  {Math.ceil(caseCooldowns[caseItem.id] / 3600000)}h
                </div>
              )}
              <div className="case-cost">
                <img src="coin.png" alt="coin" className="coin-icon" />
                {caseItem.cost}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedCase && !showBattle && (
        <div className="case-details-overlay">
          <div className="case-details">
            <img src={selectedCase.image} alt={selectedCase.name} />
            <h3>{selectedCase.name}</h3>
            <p>Победи Босса чтобы забрать кейс - стоимость участия {selectedCase.cost} очков</p>
            <button onClick={startBattle}>GO</button>
            <button onClick={handleCloseCase}>Close</button>
          </div>
        </div>
      )}
      {showBattle && (
        <div className="battle-overlay">
          <div className="close-button" onClick={handleCloseBattle}>&times;</div>
          <div className="messages-container">
            {messages.map(message => (
              <div
                key={message.id}
                className="message"
                style={{ top: `${message.y}px`, left: `${message.x}px` }}
              >
                {message.text}
              </div>
            ))}
          </div>
          <img src={kiza} alt="Kiza" className="battle-kiza" onTouchStart={handleKizaClick} />
          <div className="battle-message">
            Накликай {selectedCase.cost / 2} раз за {battleTime} секунд, чтобы победить!
          </div>
          <div className="click-counter">
            {battleClicks}
          </div>
        </div>
      )}
      {coins.map(coin => (
        <div
          key={coin.id}
          className="coin-animation"
          style={{ top: `${coin.y}px`, left: `${coin.x}px` }}
        >
          💰
        </div>
      ))}
      {notification && (
        <Notification message={notification} onClose={() => setNotification(null)} />
      )}
    </div>
  );
};

export default Earn;
