import React, { useState } from 'react';
import './Quests.css';

function Quests() {
  const [quests, setQuests] = useState([
    { id: 1, name: 'Удобрения', level: 0, maxLevel: 10, cost: 10, profit: 50 },
    { id: 2, name: 'Семена', level: 0, maxLevel: 10, cost: 20, profit: 40 },
    { id: 3, name: 'Земля', level: 0, maxLevel: 10, cost: 15, profit: 30 },
    { id: 4, name: 'Вода', level: 0, maxLevel: 10, cost: 5, profit: 20 },
    { id: 5, name: 'Лампы', level: 0, maxLevel: 10, cost: 25, profit: 60 }
  ]);

  const upgradeQuest = (id) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === id && quest.level < quest.maxLevel
          ? { ...quest, level: quest.level + 1 }
          : quest
      )
    );
  };

  return (
    <div className="quests">
      {quests.map(quest => (
        <div key={quest.id} className="quest">
          <h3>{quest.name}</h3>
          <p>Level: {quest.level}/{quest.maxLevel}</p>
          <p>Cost: {quest.cost} points</p>
          <p>Profit: {quest.profit} points/hour</p>
          <button onClick={() => upgradeQuest(quest.id)}>Upgrade</button>
        </div>
      ))}
    </div>
  );
}

export default Quests;
