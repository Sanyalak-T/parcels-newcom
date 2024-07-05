/** @format */

const logoutbtn = document.getElementById('logout');

function goToLoginPage() {
  let check = confirm('คุณกำลังจะออกจากโปรแกรมพัสดุ?');
  if (check === true) {
    location.href = '/index.html';
  }
}

logoutbtn.addEventListener('click', goToLoginPage);