async function loadGreeting() {
  const message = document.getElementById('message');
  message.textContent = 'Calling /api/hello...';
  const response = await fetch('/api/hello');
  if (!response.ok) {
    window.location.href = '/';
    return;
  }
  const data = await response.json();
  message.textContent = JSON.stringify(data);
}

document.getElementById('loadMessage').addEventListener('click', loadGreeting);

document.getElementById('logout').addEventListener('click', async () => {
  await fetch('/auth/logout', { method: 'POST' });
  window.location.href = '/';
});