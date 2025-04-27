// script.js
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let isAdmin = false;

const usernameFixed = "admin";
const passwordFixed = "1234";

const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('currentMonthYear');

const modal = document.getElementById('modal');
const modalDate = document.getElementById('modalDate');
const homeworkInput = document.getElementById('homework');
const activitiesInput = document.getElementById('activities');

let selectedDate = null;

function saveData(date, homework, activities) {
  const data = JSON.parse(localStorage.getItem('calendarData') || '{}');
  data[date] = { homework, activities };
  localStorage.setItem('calendarData', JSON.stringify(data));
}

function loadData(date) {
  const data = JSON.parse(localStorage.getItem('calendarData') || '{}');
  return data[date] || { homework: '', activities: '' };
}

function renderCalendar() {
  calendar.innerHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  monthYear.textContent = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${currentYear}-${currentMonth+1}-${day}`;
    const dayData = loadData(date);

    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    
    const today = new Date();
    if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
      dayDiv.classList.add('today');
    }

    dayDiv.innerHTML = `
      <div class="day-header">${day}</div>
      <div class="day-content">
        ${dayData.homework ? `<strong>Dever:</strong> ${dayData.homework}` : ''}
        ${dayData.activities ? `<strong>Atividades:</strong> ${dayData.activities}` : ''}
      </div>
    `;

    dayDiv.addEventListener('click', () => openModal(date));
    calendar.appendChild(dayDiv);
  }
}

function openModal(date) {
  selectedDate = date;
  const dayData = loadData(date);

  modalDate.textContent = `Dia ${date}`;
  homeworkInput.value = dayData.homework;
  activitiesInput.value = dayData.activities;

  if (isAdmin) {
    homeworkInput.disabled = false;
    activitiesInput.disabled = false;
    document.getElementById('saveBtn').style.display = 'block';
  } else {
    homeworkInput.disabled = true;
    activitiesInput.disabled = true;
    document.getElementById('saveBtn').style.display = 'none';
  }

  modal.style.display = 'flex';
}

document.getElementById('closeModal').addEventListener('click', () => {
  modal.style.display = 'none';
});

document.getElementById('saveBtn').addEventListener('click', () => {
  saveData(selectedDate, homeworkInput.value, activitiesInput.value);
  modal.style.display = 'none';
  renderCalendar();
});

document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

document.getElementById('prevYear').addEventListener('click', () => {
  currentYear--;
  renderCalendar();
});

document.getElementById('nextYear').addEventListener('click', () => {
  currentYear++;
  renderCalendar();
});

document.getElementById('loginBtn').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === usernameFixed && password === passwordFixed) {
    isAdmin = true;
    alert('Login feito com sucesso!');
    document.getElementById('logoutBtn').style.display = 'inline';
    document.getElementById('loginBtn').style.display = 'none';
  } else {
    alert('Usuário ou senha incorretos.');
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  isAdmin = false;
  alert('Deslogado.');
  document.getElementById('logoutBtn').style.display = 'none';
  document.getElementById('loginBtn').style.display = 'inline';
});

document.getElementById('showAll').addEventListener('click', () => renderCalendar());
document.getElementById('showHomework').addEventListener('click', () => renderFiltered('homework'));
document.getElementById('showActivities').addEventListener('click', () => renderFiltered('activities'));

function renderFiltered(type) {
  calendar.innerHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  monthYear.textContent = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${currentYear}-${currentMonth+1}-${day}`;
    const dayData = loadData(date);

    if ((type === 'homework' && !dayData.homework) || (type === 'activities' && !dayData.activities)) {
      const empty = document.createElement('div');
      calendar.appendChild(empty);
      continue;
    }

    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';

    const today = new Date();
    if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
      dayDiv.classList.add('today');
    }

    dayDiv.innerHTML = `
      <div class="day-header">${day}</div>
      <div class="day-content">
        ${dayData.homework ? `<strong>Dever:</strong> ${dayData.homework}` : ''}
        ${dayData.activities ? `<strong>Atividades:</strong> ${dayData.activities}` : ''}
      </div>
    `;

    dayDiv.addEventListener('click', () => openModal(date));
    calendar.appendChild(dayDiv);
  }
}

// Inicializa
renderCalendar();
