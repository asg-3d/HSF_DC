// Сохраняем настройки в localStorage.
function save_options() {
  var select = document.getElementById('interval');
  var interval = select.children[select.selectedIndex].value;
  var intervalText = select.children[select.selectedIndex].innerText;
  localStorage.refresh_interval = interval;
  localStorage.refresh_interval_text = intervalText;
  
  var audioCheckbox = document.getElementById('audio_checkbox');
  localStorage.audioOn = audioCheckbox.checked;

  // Обновляем статус, чтобы дать знать пользователю, что настройки сохранены
  var status = document.getElementById('status');
  status.innerHTML = 'Настройки сохранены';
  setTimeout(function() {
    status.innerHTML = '';
  }, 1150);
}

// Восстанавливаем статус (состояние) списка выбора интервала автообновления из значения сохранённого в localStorage
function restore_options() {
  var refresh_interval = localStorage.refresh_interval;
  if (!refresh_interval) {
    return;
  }
  var select = document.getElementById('interval');
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == refresh_interval) {
      child.selected = 'true';
      break;
    }
  }

  var audioCheckbox = document.getElementById('audio_checkbox');
  audioCheckbox.checked = localStorage.audioOn;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);