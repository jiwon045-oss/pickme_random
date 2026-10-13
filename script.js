'use strict';

// 학생 이름을 담는 배열. 새로고침하면 비워진다.
let students = [];

// 자주 쓰는 화면 요소를 미리 찾아둔다.
const nameInput = document.getElementById('nameInput');
const addButton = document.getElementById('addButton');
const pickButton = document.getElementById('pickButton');
const resetButton = document.getElementById('resetButton');
const studentList = document.getElementById('studentList');
const studentCount = document.getElementById('studentCount');
const emptyHint = document.getElementById('emptyHint');
const resultName = document.getElementById('resultName');

// 현재 뽑힌 발표자의 이름(목록에서 표시용). 없으면 빈 문자열.
let pickedName = '';

// 학생 목록을 화면에 다시 그린다.
function renderList() {
  studentList.innerHTML = '';

  students.forEach(function (name, index) {
    const item = document.createElement('li');
    item.className = 'student-item';
    if (name === pickedName) {
      item.classList.add('is-picked');
    }

    const nameText = document.createElement('span');
    nameText.className = 'student-name';
    nameText.textContent = name;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '✕';
    deleteButton.setAttribute('aria-label', name + ' 삭제');
    // 삭제 버튼을 누르면 해당 학생만 지운다.
    deleteButton.addEventListener('click', function () {
      removeStudent(index);
    });

    item.appendChild(nameText);
    item.appendChild(deleteButton);
    studentList.appendChild(item);
  });

  // 학생 수와 안내 문구를 갱신한다.
  studentCount.textContent = students.length + '명';
  emptyHint.classList.toggle('is-hidden', students.length > 0);
}

// 입력한 이름을 목록에 추가한다.
function addStudent() {
  const name = nameInput.value.trim();

  // 빈 이름은 추가하지 않는다.
  if (name === '') {
    nameInput.focus();
    return;
  }

  students.push(name);
  nameInput.value = '';
  nameInput.focus();
  renderList();
}

// index번째 학생을 목록에서 지운다.
function removeStudent(index) {
  students.splice(index, 1);
  renderList();
}

// 등록된 학생 중 한 명을 무작위로 뽑는다.
function pickStudent() {
  // 학생이 없으면 안내 문구만 보여준다.
  if (students.length === 0) {
    pickedName = '';
    showResult('학생을 먼저 추가해 주세요', true);
    renderList();
    return;
  }

  const randomIndex = Math.floor(Math.random() * students.length);
  pickedName = students[randomIndex];
  showResult(pickedName, false);
  renderList();
}

// 결과 영역에 이름을 크게 보여준다.
function showResult(text, isHint) {
  resultName.textContent = text;
  resultName.classList.toggle('is-placeholder', isHint);

  // 뽑기 애니메이션을 다시 실행하기 위해 클래스를 껐다 켠다.
  resultName.classList.remove('is-pop');
  void resultName.offsetWidth;
  if (!isHint) {
    resultName.classList.add('is-pop');
  }
}

// 학생 목록과 발표자 결과를 모두 초기화한다.
function resetAll() {
  // 실수로 지우지 않도록 확인창을 띄운다.
  const confirmed = window.confirm('모든 학생과 발표자 결과를 초기화할까요?');
  if (!confirmed) {
    return;
  }

  students = [];
  pickedName = '';
  resultName.textContent = '아직 안 뽑았어요';
  resultName.classList.add('is-placeholder');
  renderList();
}

addButton.addEventListener('click', addStudent);
pickButton.addEventListener('click', pickStudent);
resetButton.addEventListener('click', resetAll);

// Enter 키로도 학생을 추가할 수 있다.
nameInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addStudent();
  }
});

// 처음 화면을 그린다.
renderList();
