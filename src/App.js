import React, { useEffect, useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faHammer, faUserFriends, faHandHoldingUsd, faCoins, faEllipsisH, faTint, faSeedling, faTruck, faFileInvoiceDollar, faLeaf, faHome, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import Mine from './Mine';
import Friends from './Friends';
import Earn from './Earn';
import Airdrop from './Airdrop';
import Notification from './Notification';

function App() {
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [messages, setMessages] = useState([]);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [level, setLevel] = useState(1);
  const [coinsPerTap, setCoinsPerTap] = useState(2);
  const [coinsToLevelUp, setCoinsToLevelUp] = useState(500); // Начальное количество очков для повышения уровня
  const [activeButton, setActiveButton] = useState('exchange');
  const [username, setUsername] = useState('User');
  const [notifications, setNotifications] = useState([]);
  const [hourlyIncome, setHourlyIncome] = useState(0); // Доход в час

  const initialQuests = [
    { id: 1, title: 'Купить удобрения', cost: 10, income: 5, level: 0, icon: faLeaf },
    { id: 2, title: 'Купить грунт', cost: 20, income: 10, level: 0, icon: faTint },
    { id: 3, title: 'Купить семена', cost: 30, income: 15, level: 0, icon: faSeedling },
    { id: 4, title: 'Заплатить налоги', cost: 40, income: 20, level: 0, icon: faFileInvoiceDollar },
    { id: 5, title: 'Отправить товар в CoffeeShop', cost: 50, income: 25, level: 0, icon: faTruck },
    { id: 6, title: 'Купить лицензию', cost: 60, income: 30, level: 0, icon: faHandHoldingUsd }
  ];

  const [quests, setQuests] = useState(initialQuests);

  useEffect(() => {
    const img = new Image();
    img.src = 'background1.jpg';
    img.onload = () => {
      setBackgroundLoaded(true);
    };

    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand(); // Разворачивание приложения на полный экран
      setUsername(tg.initDataUnsafe.user ? tg.initDataUnsafe.user.username : 'User');
    }

    const preventSwipe = (e) => {
      if (e.touches.length >= 1 && activeButton === 'exchange' && !e.target.closest('.buttons-container')) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventSwipe, { passive: false });
    document.addEventListener('touchmove', preventSwipe, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventSwipe);
      document.removeEventListener('touchmove', preventSwipe);
    };
  }, [activeButton]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prevPoints => {
        const newPoints = prevPoints + hourlyIncome;
        setTotalPoints(prevTotalPoints => prevTotalPoints + hourlyIncome);
        return newPoints;
      });
    }, 10000); // Обновление очков каждые 10 секунд для тестирования

    return () => clearInterval(interval);
  }, [hourlyIncome]);

  const handleTouchStart = (event) => {
    const plantElement = document.querySelector('.plant');
    const rect = plantElement.getBoundingClientRect();

    Array.from(event.changedTouches).forEach(touch => {
      const touchX = touch.clientX;
      const touchY = touch.clientY;

      if (
        touchX >= rect.left &&
        touchX <= rect.right &&
        touchY >= rect.top &&
        touchY <= rect.bottom
      ) {
        setPoints(prevPoints => {
          const newPoints = prevPoints + coinsPerTap;
          setTotalPoints(prevTotalPoints => prevTotalPoints + coinsPerTap);
          if (newPoints >= coinsToLevelUp) {
            setLevel(prevLevel => {
              const newLevel = prevLevel + 1;
              setCoinsToLevelUp(500 + newLevel * 2000);
              setNotifications(prevNotifications => [
                ...prevNotifications,
                `Congratulations, you have reached level ${newLevel}, keep going - airdrop soon`
              ]);
              return newLevel;
            });
            return newPoints - coinsToLevelUp;
          } else {
            return newPoints;
          }
        });

        const newMessage = {
          id: Date.now() + touch.identifier,
          text: `+${coinsPerTap} 💨`,
          x: touchX,
          y: touchY
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);

        setTimeout(() => {
          setMessages(prevMessages =>
            prevMessages.filter(msg => msg.id !== newMessage.id)
          );
        }, 2000);
      }
    });
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const formatPoints = (points) => {
    if (points < 1000000) {
      return points;
    }
    const thousands = Math.floor(points / 1000);
    return `${(thousands / 1000).toFixed(3)}k`;
  };

  const calculateLevelProgress = () => {
    return (points / coinsToLevelUp) * 100;
  };

  const handleQuestPurchase = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (points >= quest.cost) {
      setPoints(points - quest.cost);
      setTotalPoints(prevTotalPoints => prevTotalPoints + quest.cost);
      setHourlyIncome(prevIncome => prevIncome + quest.income);
      const updatedQuests = quests.map(q => {
        if (q.id === questId) {
          return { ...q, cost: q.cost * 2, income: q.income * 2, level: q.level + 1 };
        }
        return q;
      });
      setQuests(updatedQuests);
      setNotifications(prevNotifications => [
        ...prevNotifications,
        `You have successfully purchased ${quest.title} for ${quest.cost} coins. Now you earn +${quest.income} per hour.`
      ]);
    } else {
      alert('Недостаточно очков для выполнения квеста.');
    }
  };

  const handleNotificationClose = (index) => {
    setNotifications(prevNotifications => prevNotifications.filter((_, i) => i !== index));
  };

  const renderContent = () => {
    switch (activeButton) {
      case 'exchange':
        return (
          <div className="plant-container">
            <div className="plant"></div>
          </div>
        );
      case 'mine':
        return <Mine points={points} quests={quests} onQuestPurchase={handleQuestPurchase} hourlyIncome={hourlyIncome} />;
      case 'friends':
        return <Friends />;
      case 'earn':
        return <Earn />;
      case 'airdrop':
        return <Airdrop />;
      default:
        return null;
    }
  };

  if (!backgroundLoaded) {
    return null;
  }

  return (
    <div className={`App ${activeButton !== 'exchange' && activeButton !== 'earn' ? 'no-background' : ''} ${activeButton === 'mine' ? 'mine-scroll' : ''}`} onTouchStart={handleTouchStart}>
      <div className="header">
        <div className="header-top">
          <div className="header-col" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="avatar.png" alt="avatar" className="avatar" />
            <span className="username">{username}</span>
          </div>
          <div className="header-col">
            <FontAwesomeIcon icon={faEllipsisH} className="settings-icon" />
          </div>
        </div>
        {activeButton === 'exchange' && (
          <div className="header-bottom">
            <div className="coin-display">
              <img src="coin.png" alt="coin" className="coin" />
              <h1>{formatPoints(points)}</h1>
            </div>
            <div className="level-display">
              <div className="level-bar-container">
                <div className="level-bar" style={{ width: `${calculateLevelProgress()}%` }}></div>
              </div>
              <div className="level-text">Grower {level}/1000000</div>
            </div>
          </div>
        )}
      </div>
      <div className="stats-display">
        <div className="stat-item">
          <span className="stat-label">Level:</span>
          <span>{level}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Points:</span>
          <span>{formatPoints(points)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Points:</span>
          <span>{formatPoints(totalPoints)}</span>
        </div>
      </div>
      {renderContent()}
      <div className="buttons-container">
        <div className={`button ${activeButton === 'exchange' ? 'active' : ''}`} id="exchange" onClick={() => handleButtonClick('exchange')}>
          <FontAwesomeIcon icon={faHome} />
          Main
        </div>
        <div className={`button ${activeButton === 'mine' ? 'active' : ''}`} id="mine" onClick={() => handleButtonClick('mine')}>
          <FontAwesomeIcon icon={faHammer} />
          Mine
        </div>
        <div className={`button ${activeButton === 'friends' ? 'active' : ''}`} id="friends" onClick={() => handleButtonClick('friends')}>
          <FontAwesomeIcon icon={faUserFriends} />
          Community
        </div>
        <div className={`button ${activeButton === 'earn' ? 'active' : ''}`} id="earn" onClick={() => handleButtonClick('earn')}>
          <FontAwesomeIcon icon={faBoxOpen} />
          Case
        </div>
        <div className={`button ${activeButton === 'airdrop' ? 'active' : ''}`} id="airdrop" onClick={() => handleButtonClick('airdrop')}>
          <FontAwesomeIcon icon={faCoins} />
          Airdrop
        </div>
      </div>
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
      <div className="notification-container">
        {notifications.map((message, index) => (
          <Notification
            key={index}
            message={message}
            onClose={() => handleNotificationClose(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
