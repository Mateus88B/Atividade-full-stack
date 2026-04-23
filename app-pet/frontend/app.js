const API_BASE = 'https://atividade-full-stack1.onrender.com/api';

const entryForm = document.getElementById('entry-form');
const entryId = document.getElementById('entry-id');
const entryTitle = document.getElementById('title');
const entryDescription = document.getElementById('description');
const happenedAt = document.getElementById('happenedAt');
const entryMessage = document.getElementById('entry-message');
const entryFormTitle = document.getElementById('entry-form-title');
const cancelEntryEditButton = document.getElementById('cancel-entry-edit');
const reloadEntriesButton = document.getElementById('reload-entries');
const entriesList = document.getElementById('entries-list');

const appointmentForm = document.getElementById('appointment-form');
const appointmentId = document.getElementById('appointment-id');
const petName = document.getElementById('petName');
const serviceType = document.getElementById('serviceType');
const appointmentDate = document.getElementById('appointmentDate');
const status = document.getElementById('status');
const notes = document.getElementById('notes');
const appointmentMessage = document.getElementById('appointment-message');
const appointmentFormTitle = document.getElementById('appointment-form-title');
const cancelAppointmentEditButton = document.getElementById('cancel-appointment-edit');
const reloadAppointmentsButton = document.getElementById('reload-appointments');
const appointmentsList = document.getElementById('appointments-list');

function getEntriesUrl() {
  return `${API_BASE}/entries`;
}

function getAppointmentsUrl() {
  return `${API_BASE}/appointments`;
}

function showFeedback(element, text, isError = false) {
  element.textContent = text;
  element.style.color = isError ? '#dc2626' : '#047857';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(date) {
  return new Date(date).toLocaleString('pt-BR');
}

function formatStatus(value) {
  const map = {
    agendado: 'Agendado',
    concluido: 'Concluído',
    cancelado: 'Cancelado'
  };

  return map[value] || value;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data.message
      ? data.message
      : 'Não foi possível concluir a operação.';

    throw new Error(message);
  }

  return data;
}

function resetEntryForm() {
  entryForm.reset();
  entryId.value = '';
  entryFormTitle.textContent = 'Novo registro do diário';
  cancelEntryEditButton.classList.add('hidden');
  happenedAt.value = new Date().toISOString().slice(0, 16);
}

function resetAppointmentForm() {
  appointmentForm.reset();
  appointmentId.value = '';
  appointmentFormTitle.textContent = 'Novo agendamento';
  cancelAppointmentEditButton.classList.add('hidden');
  appointmentDate.value = new Date().toISOString().slice(0, 16);
  status.value = 'agendado';
}

function renderEntries(entries) {
  if (!entries.length) {
    entriesList.innerHTML = '<p class="empty-state">Nenhum registro encontrado.</p>';
    return;
  }

  entriesList.innerHTML = entries.map((entry) => `
    <article class="item-card">
      <h3>${escapeHtml(entry.title)}</h3>
      <p class="item-meta">${formatDate(entry.happenedAt)}</p>
      <p>${escapeHtml(entry.description)}</p>
      <div class="item-actions">
        <button type="button" data-entry-edit="${entry._id}" class="secondary-button">Editar</button>
        <button type="button" data-entry-delete="${entry._id}" class="danger-button">Excluir</button>
      </div>
    </article>
  `).join('');
}

function renderAppointments(appointments) {
  if (!appointments.length) {
    appointmentsList.innerHTML = '<p class="empty-state">Nenhum agendamento encontrado.</p>';
    return;
  }

  appointmentsList.innerHTML = appointments.map((appointment) => `
    <article class="item-card">
      <div class="section-header">
        <h3>${escapeHtml(appointment.petName)}</h3>
        <span class="status-badge">${escapeHtml(formatStatus(appointment.status))}</span>
      </div>
      <p class="item-meta">${formatDate(appointment.appointmentDate)}</p>
      <p><strong>Serviço:</strong> ${escapeHtml(appointment.serviceType)}</p>
      <p><strong>Observações:</strong> ${escapeHtml(appointment.notes || 'Sem observações.')}</p>
      <div class="item-actions">
        <button type="button" data-appointment-edit="${appointment._id}" class="secondary-button">Editar</button>
        <button type="button" data-appointment-delete="${appointment._id}" class="danger-button">Excluir</button>
      </div>
    </article>
  `).join('');
}

async function loadEntries() {
  try {
    const entries = await request(getEntriesUrl());
    renderEntries(entries);
  } catch (error) {
    entriesList.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
    showFeedback(entryMessage, error.message, true);
  }
}

async function loadAppointments() {
  try {
    const appointments = await request(getAppointmentsUrl());
    renderAppointments(appointments);
  } catch (error) {
    appointmentsList.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
    showFeedback(appointmentMessage, error.message, true);
  }
}

entryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    title: entryTitle.value,
    description: entryDescription.value,
    happenedAt: happenedAt.value
  };

  const id = entryId.value;
  const url = id ? `${getEntriesUrl()}/${id}` : getEntriesUrl();
  const method = id ? 'PUT' : 'POST';

  try {
    await request(url, {
      method,
      body: JSON.stringify(payload)
    });

    showFeedback(entryMessage, id ? 'Registro atualizado com sucesso.' : 'Registro criado com sucesso.');
    resetEntryForm();
    loadEntries();
  } catch (error) {
    showFeedback(entryMessage, error.message, true);
  }
});

appointmentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    petName: petName.value,
    serviceType: serviceType.value,
    appointmentDate: appointmentDate.value,
    status: status.value,
    notes: notes.value
  };

  const id = appointmentId.value;
  const url = id ? `${getAppointmentsUrl()}/${id}` : getAppointmentsUrl();
  const method = id ? 'PUT' : 'POST';

  try {
    await request(url, {
      method,
      body: JSON.stringify(payload)
    });

    showFeedback(appointmentMessage, id ? 'Agendamento atualizado com sucesso.' : 'Agendamento criado com sucesso.');
    resetAppointmentForm();
    loadAppointments();
  } catch (error) {
    showFeedback(appointmentMessage, error.message, true);
  }
});

entriesList.addEventListener('click', async (event) => {
  const editButton = event.target.closest('[data-entry-edit]');
  const deleteButton = event.target.closest('[data-entry-delete]');

  if (editButton) {
    try {
      const id = editButton.dataset.entryEdit;
      const entry = await request(`${getEntriesUrl()}/${id}`);

      entryId.value = entry._id;
      entryTitle.value = entry.title;
      entryDescription.value = entry.description;
      happenedAt.value = new Date(entry.happenedAt).toISOString().slice(0, 16);
      entryFormTitle.textContent = 'Editar registro do diário';
      cancelEntryEditButton.classList.remove('hidden');
      showFeedback(entryMessage, 'Editando registro.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showFeedback(entryMessage, error.message, true);
    }
  }

  if (deleteButton) {
    const confirmed = window.confirm('Deseja excluir este registro?');

    if (!confirmed) {
      return;
    }

    try {
      const id = deleteButton.dataset.entryDelete;
      await request(`${getEntriesUrl()}/${id}`, { method: 'DELETE' });
      showFeedback(entryMessage, 'Registro removido com sucesso.');
      loadEntries();
    } catch (error) {
      showFeedback(entryMessage, error.message, true);
    }
  }
});

appointmentsList.addEventListener('click', async (event) => {
  const editButton = event.target.closest('[data-appointment-edit]');
  const deleteButton = event.target.closest('[data-appointment-delete]');

  if (editButton) {
    try {
      const id = editButton.dataset.appointmentEdit;
      const appointment = await request(`${getAppointmentsUrl()}/${id}`);

      appointmentId.value = appointment._id;
      petName.value = appointment.petName;
      serviceType.value = appointment.serviceType;
      appointmentDate.value = new Date(appointment.appointmentDate).toISOString().slice(0, 16);
      status.value = appointment.status;
      notes.value = appointment.notes || '';
      appointmentFormTitle.textContent = 'Editar agendamento';
      cancelAppointmentEditButton.classList.remove('hidden');
      showFeedback(appointmentMessage, 'Editando agendamento.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showFeedback(appointmentMessage, error.message, true);
    }
  }

  if (deleteButton) {
    const confirmed = window.confirm('Deseja excluir este agendamento?');

    if (!confirmed) {
      return;
    }

    try {
      const id = deleteButton.dataset.appointmentDelete;
      await request(`${getAppointmentsUrl()}/${id}`, { method: 'DELETE' });
      showFeedback(appointmentMessage, 'Agendamento removido com sucesso.');
      loadAppointments();
    } catch (error) {
      showFeedback(appointmentMessage, error.message, true);
    }
  }
});

cancelEntryEditButton.addEventListener('click', () => {
  resetEntryForm();
  showFeedback(entryMessage, 'Edição do registro cancelada.');
});

cancelAppointmentEditButton.addEventListener('click', () => {
  resetAppointmentForm();
  showFeedback(appointmentMessage, 'Edição do agendamento cancelada.');
});

reloadEntriesButton.addEventListener('click', loadEntries);
reloadAppointmentsButton.addEventListener('click', loadAppointments);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./service-worker.js');
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  });
}

resetEntryForm();
resetAppointmentForm();
loadEntries();
loadAppointments();