

async function saveData() {
    const table = document.getElementById('tableSelect').value;
    const form = document.getElementById('dataForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!table || Object.keys(data).length === 0) {
        alert('Выберите таблицу и заполните поля');
        return;
    }

    try {
        let endpoint, body;

        switch(table) {
            case 'apps':
                endpoint = '/api/apps';
                body = {
                    processName: data.process_name,
                    baseName: data.base_name || data.process_name
                };
                break;

            case 'sites':
                endpoint = '/api/sites';
                body = { domain: data.domain };
                break;

            case 'videos':
                endpoint = '/api/videos';
                body = {
                    video_id: data.video_id,
                    title: data.title,
                    author: data.author,
                    video_duration: parseInt(data.video_duration)
                };
                break;

            case 'app_sessions':
                endpoint = '/api/sessions/app';
                body = {
                    windowTitle: data.window_title,
                    activationDate: data.activation_date,
                    activationTime: data.activation_time + ':00',
                    shutdownDate: data.shutdown_date || null,
                    shutdownTime: data.shutdown_time ? data.shutdown_time + ':00' : null,
                    app: { processName: data.process_name }
                };
                break;

            case 'page_sessions':
                endpoint = '/api/sessions/page';
                body = {
                    pageTitle: data.page_title,
                    activationDate: data.activation_date,
                    activationTime: data.activation_time + ':00',
                    site: { domain: data.domain },
                    browser: { processName: data.browser_name }
                };
                break;

            case 'view_sessions':
                endpoint = '/api/sessions/view';
                body = {
                    domain: data.domain || 'youtube.com',
                    viewingTime: data.viewing_time ? parseInt(data.viewing_time) : null,
                    activationDate: data.activation_date,
                    activationTime: data.activation_time + ':00',
                    video: { video_id: data.video_id }
                };
                break;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            closeDataModal();
        } else {
            const error = await response.json();
            alert('Ошибка при добавлении данных: ' + (error.message || response.statusText));
        }
    } catch (error) {
        alert('Ошибка при добавлении данных: ' + error.message);
        console.error(error);
    }
}
// Показать модалку
function showDataModal() {
    console.log('showDataModal called');
    document.getElementById('dataModal').style.display = 'flex';
    document.getElementById('tableSelect').selectedIndex = 0;
    resetForm();
}

// Закрыть модалку
function closeDataModal() {
    console.log('closeDataModal called');
    document.getElementById('dataModal').style.display = 'none';
}

// Сбросить форму
function resetForm() {
    console.log('resetForm called');
    document.getElementById('dataForm').reset();
    document.getElementById('saveBtn').disabled = true;
    document.getElementById('formFields').innerHTML =
        '<p class="hint">Выберите таблицу для отображения полей</p>';
}

// Изменить поля при выборе таблицы
function changeTable() {
    console.log('changeTable called');
    const table = document.getElementById('tableSelect').value;
    const formFields = document.getElementById('formFields');
    const saveBtn = document.getElementById('saveBtn');

    if (!table) {
        resetForm();
        return;
    }

    saveBtn.disabled = false;
    let fieldsHtml = '';

    switch(table) {
        case 'apps':
            fieldsHtml = `
                <div class="form-group">
                    <label for="process_name">Имя процесса *</label>
                    <input type="text" id="process_name" name="process_name"
                           placeholder="chrome.exe" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="base_name">Описание</label>
                    <input type="text" id="base_name" name="base_name"
                           placeholder="Google Chrome" class="form-input">
                </div>
            `;
            break;

        case 'sites':
            fieldsHtml = `
                <div class="form-group">
                    <label for="domain">Домен сайта *</label>
                    <input type="text" id="domain" name="domain"
                           placeholder="google.com" class="form-input" required>
                </div>
            `;
            break;

        case 'videos':
            fieldsHtml = `
                <div class="form-group">
                    <label for="video_id">ID видео *</label>
                    <input type="text" id="video_id" name="video_id"
                           placeholder="dQw4w9WgXcQ" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="title">Название видео *</label>
                    <input type="text" id="title" name="title"
                           placeholder="Название видео" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="author">Автор *</label>
                    <input type="text" id="author" name="author"
                           placeholder="Автор канала" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="video_duration">Длительность (сек) *</label>
                    <input type="number" id="video_duration" name="video_duration"
                           placeholder="360" class="form-input" required min="1">
                </div>
            `;
            break;

        case 'app_sessions':
            fieldsHtml = `
                <div class="form-group">
                    <label for="app_process_name">Имя процесса *</label>
                    <input type="text" id="app_process_name" name="process_name"
                           placeholder="chrome.exe" class="form-input" required>

                </div>
                <div class="form-group">
                    <label for="window_title">Заголовок окна *</label>
                    <input type="text" id="window_title" name="window_title"
                           placeholder="Google Chrome" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="activation_date">Дата открытия</label>
                    <input type="date" id="activation_date" name="activation_date"
                           class="form-input" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="activation_time">Время открытия</label>
                    <input type="time" id="activation_time" name="activation_time"
                           class="form-input" value="${new Date().toTimeString().substring(0,5)}">
                </div>
                <div class="form-group">
                    <label for="shutdown_date">Дата закрытия (если есть)</label>
                    <input type="date" id="shutdown_date" name="shutdown_date" class="form-input">
                </div>
                <div class="form-group">
                    <label for="shutdown_time">Время закрытия (если есть)</label>
                    <input type="time" id="shutdown_time" name="shutdown_time" class="form-input">
                </div>
            `;
            break;

        case 'page_sessions':
            fieldsHtml = `
                <div class="form-group">
                    <label for="page_domain">Домен сайта *</label>
                    <input type="text" id="page_domain" name="domain"
                           placeholder="google.com" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="browser_name">Браузер *</label>
                    <input type="text" id="browser_name" name="browser_name"
                           placeholder="chrome.exe" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="page_title">Заголовок страницы *</label>
                    <input type="text" id="page_title" name="page_title"
                           placeholder="Google" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="page_activation_date">Дата открытия</label>
                    <input type="date" id="page_activation_date" name="activation_date"
                           class="form-input" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="page_activation_time">Время открытия</label>
                    <input type="time" id="page_activation_time" name="activation_time"
                           class="form-input" value="${new Date().toTimeString().substring(0,5)}">
                </div>
            `;
            break;

        case 'view_sessions':
            fieldsHtml = `
                <div class="form-group">
                    <label for="view_video_id">ID видео YouTube *</label>
                    <input type="text" id="view_video_id" name="video_id"
                           placeholder="dQw4w9WgXcQ" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="view_domain">Домен сайта</label>
                    <input type="text" id="view_domain" name="domain"
                           placeholder="youtube.com" class="form-input" value="youtube.com">
                </div>
                <div class="form-group">
                    <label for="viewing_time">Время просмотра (сек)</label>
                    <input type="number" id="viewing_time" name="viewing_time"
                           placeholder="300" class="form-input" min="1">
                </div>
                <div class="form-group">
                    <label for="view_activation_date">Дата начала</label>
                    <input type="date" id="view_activation_date" name="activation_date"
                           class="form-input" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="view_activation_time">Время начала</label>
                    <input type="time" id="view_activation_time" name="activation_time"
                           class="form-input" value="${new Date().toTimeString().substring(0,5)}">
                </div>
            `;
            break;
    }

    formFields.innerHTML = fieldsHtml;
}

// Инициализация обработчиков
function initModalHandlers() {
    console.log('Initializing modal handlers...');

    // 1. Кнопка открытия модалки
    const openBtn = document.getElementById('openDataModal');
    if (openBtn) {
        openBtn.addEventListener('click', showDataModal);
        console.log('Open button handler attached');
    } else {
        console.error('openDataModal button not found!');
    }



    // 3. Кнопка отмены
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDataModal);
        console.log('Cancel button handler attached');
    }

    // 4. Кнопка сохранения
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveData);
        console.log('Save button handler attached');
    }

    // 5. Select для изменения таблицы
    const tableSelect = document.getElementById('tableSelect');
    if (tableSelect) {
        tableSelect.addEventListener('change', changeTable);
        console.log('Table select handler attached');
    }

    // 6. Закрытие по клику вне модалки
    const modalOverlay = document.getElementById('dataModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay) {
                closeDataModal();
            }
        });
        console.log('Overlay click handler attached');
    }

    // 7. Закрытие по клавише Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeDataModal();
        }
    });

    console.log('All handlers initialized');
}

// Вызов инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing modal...');
    initModalHandlers();
});
