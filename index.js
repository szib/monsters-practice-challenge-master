const URL = 'http://localhost:3000/monsters';
const monstersContainer = document.querySelector('#monster-container');
const backBtn = document.querySelector('#back');
const forwardBtn = document.querySelector('#forward');
const createMonsterForm = document.querySelector('#create-monster form');
const submitBtn = createMonsterForm.querySelector('button');

let currentPage = 1;

const fetchMonsters = (page) => {
  const url = `${URL}/?_limit=50&_page=${page}`;
  return fetch(url).then(resp => resp.json());
};

const createMonsterCard = (monster) => {
  const card = document.createElement('div');
  card.className = 'ui raised card';
  card.innerHTML = `
    <div class="content">
      <div class="header">${monster.name}</div>
      <div class="meta">Age: ${parseInt(monster.age, 10)}</div>
      <div class="description">
        ${monster.description}
      </div>
    </div>
  `;
  return card;
};

const addMonstersToContainer = (monsters) => {
  monsters.forEach((monster) => {
    const card = createMonsterCard(monster);
    monstersContainer.appendChild(card);
  });
};

const updateMonstersContent = (page) => {
  if (page > 0) {
    fetchMonsters(page).then((monsters) => {
      if (monsters.length > 0) {
        currentPage = page;
        monstersContainer.innerText = '';
        addMonstersToContainer(monsters);
      }
    });
  }
};

const moveForward = () => {
  updateMonstersContent(currentPage + 1);
};

const moveBack = () => {
  updateMonstersContent(currentPage - 1);
};

const createMonster = (monster) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(monster),
  };

  return fetch(URL, options)
    .then(resp => resp.json())
    .then((json) => {
      const card = createMonsterCard(json);
      monstersContainer.appendChild(card);
    });
};

// ========================================
document.addEventListener('DOMContentLoaded', (event) => {
  updateMonstersContent(currentPage);

  backBtn.addEventListener('click', moveBack);
  forwardBtn.addEventListener('click', moveForward);
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const monster = {
      name: createMonsterForm.name.value,
      age: createMonsterForm.age.value,
      description: createMonsterForm.description.value,
    };
    createMonster(monster);
  });
});
