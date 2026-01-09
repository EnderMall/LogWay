function truncate(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}ч ${mins}м`;
    } else {
        return `${mins}м`;
    }
}

function formatVideoTime(seconds) {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}


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
                    baseName: data.base_name,
                };
                break;

            case 'sites':
                endpoint = '/api/sites';
                body = { domain: data.domain };
                break;

            case 'videos':
                endpoint = '/api/videos';
                body = {
                    videoId: data.video_id,
                    title: data.title,
                    author: data.author,
                    videoDuration: parseInt(data.video_duration)
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
                    shutdownDate: data.shutdown_date || null,
                    shutdownTime: data.shutdown_time ? data.shutdown_time + ':00' : null,
                    site: { domain: data.domain },
                    browser: { processName: data.browser_name }
                };
                break;

            case 'view_sessions':
                endpoint = '/api/sessions/view';
                body = {
                    site: { domain: data.domain },
                    viewingTime: data.viewing_time,
                    activationDate: data.activation_date,
                    activationTime: data.activation_time + ':00',
                    shutdownDate: data.shutdown_date || null,
                    shutdownTime: data.shutdown_time ? data.shutdown_time + ':00' : null,
                    video: { videoId: data.video_id }
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
                    <label for="view_activation_date">Дата начала просмотра</label>
                    <input type="date" id="view_activation_date" name="activation_date"
                           class="form-input" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="view_activation_time">Время начала просмотра</label>
                    <input type="time" id="view_activation_time" name="activation_time"
                           class="form-input" value="${new Date().toTimeString().substring(0,5)}">
                </div>
                <div class="form-group">
                    <label for="shutdown_date">Дата окончания просмотра (если есть)</label>
                    <input type="date" id="shutdown_date" name="shutdown_date" class="form-input">
                </div>
                <div class="form-group">
                    <label for="shutdown_time">Время окончания просмотра (если есть)</label>
                    <input type="time" id="shutdown_time" name="shutdown_time" class="form-input">
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


    // 7. Закрытие по клавише Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeDataModal();
        }
    });

    console.log('All handlers initialized');
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing modal...');
    initModalHandlers();
});








// ============ ТАБЛИЦА ПРИЛОЖЕНИЙ ============

// Загрузить таблицу
async function loadAppTable(event) {
    document.querySelector('.app-active').style.display = 'flex';
    document.querySelector('.app-active-compact').style.display = 'none';
    const tbody = document.getElementById('appTableBody');
    const btn = event?.target?.closest('.refresh-btn') || document.querySelector('.app-active .refresh-btn');

    try {
        tbody.innerHTML = '<tr><td colspan="6">Загрузка...</td></tr>';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳';
        }

        const response = await fetch('/api/sessions/app');
        const sessions = await response.json();

        if (!sessions || sessions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Нет данных</td></tr>';
            return;
        }

        // Сортируем новые сверху
        sessions.sort((a, b) => {
            const dateA = new Date(`${a.activationDate}T${a.activationTime}`);
            const dateB = new Date(`${b.activationDate}T${b.activationTime}`);
            return dateB - dateA;
        });

        // Отображаем все записи
        let html = '';
        sessions.forEach(session => {
            const appName = session.app?.processName;
            const openTime = session.activationTime.substring(0, 5);
            const closeTime = session.shutdownTime;

           html += `
           <tr>
               <td title="${appName}">${truncate(appName, 15)}</td>
               <td title="${session.windowTitle}">${truncate(session.windowTitle, 25)}</td>
               <td>${session.activationDate}</td>
               <td>${openTime}</td>
               <td>${session.shutdownDate}</td>
               <td>${closeTime}</td>
           </tr>
           `;
        });

        tbody.innerHTML = html;

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }

        console.log(`Загружено ${sessions.length} записей`);

    } catch (error) {
        console.error('Ошибка:', error);
        tbody.innerHTML = '<tr><td colspan="6">Ошибка загрузки</td></tr>';
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }
    }
}



// Загрузить статистику по времени приложений (все приложения, даже с нулевым временем)
async function loadAppTimeStats(event) {
    document.querySelector('.app-time').style.display = 'flex';
    document.querySelector('.app-time-compact').style.display = 'none';
    const tbody = document.getElementById('appStatsBody');
    const btn = event?.target?.closest('.refresh-btn') || document.querySelector('.app-time .refresh-btn');

    try {
        tbody.innerHTML = '<tr><td colspan="3">Загрузка...</td></tr>';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳';
        }

        // 1. Загружаем ВСЕ приложения
        const appsResponse = await fetch('/api/apps');
        const allApps = await appsResponse.json();

        // 2. Загружаем сессии приложений
        const sessionsResponse = await fetch('/api/sessions/app');
        const sessions = await sessionsResponse.json();

        // 3. Создаем мапу для быстрого доступа к статистике
        const appStatsMap = {};

        // 4. Инициализируем все приложения с нулевым временем
        allApps.forEach(app => {
            appStatsMap[app.processName] = {
                appName: app.processName,
                baseName: app.baseName || app.processName,
                sessionCount: 0,
                totalMinutes: 0
            };
        });

        // 5. Рассчитываем статистику по сессиям
        sessions.forEach(session => {
            const appName = session.app?.processName;

            // Если приложение не в списке всех приложений, добавляем его
            if (!appStatsMap[appName]) {
                appStatsMap[appName] = {
                    appName: appName,
                    baseName: session.app?.baseName || appName,
                    sessionCount: 0,
                    totalMinutes: 0
                };
            }

            // Увеличиваем счетчик сессий
            appStatsMap[appName].sessionCount++;

            // Рассчитываем время сессии
            const sessionMinutes = calculateSessionDuration(session);
            appStatsMap[appName].totalMinutes += sessionMinutes;
        });

        // 6. Преобразуем в массив и сортируем
        const appStatsArray = Object.values(appStatsMap);

        // Сортируем по общему времени (убывание), потом по имени
        appStatsArray.sort((a, b) => {
            if (b.totalMinutes !== a.totalMinutes) {
                return b.totalMinutes - a.totalMinutes;
            }
            return a.appName.localeCompare(b.appName);
        });

        // 7. Отображаем статистику
        displayAppStatistics(appStatsArray);

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }

        console.log(`Показано ${appStatsArray.length} приложений (все)`);

    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        tbody.innerHTML = '<tr><td colspan="3">Ошибка загрузки</td></tr>';
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }
    }
}

// Рассчитать статистику по приложениям
function calculateAppStatistics(sessions) {
    const appStats = {};

    sessions.forEach(session => {
        const appName = session.app?.processName;

        // Инициализируем объект для приложения если его нет
        if (!appStats[appName]) {
            appStats[appName] = {
                appName: appName,
                sessionCount: 0,
                totalMinutes: 0
            };
        }

        // Увеличиваем счетчик сессий
        appStats[appName].sessionCount++;

        // Рассчитываем время сессии
        const sessionMinutes = calculateSessionDuration(session);
        appStats[appName].totalMinutes += sessionMinutes;
    });

    return appStats;
}

// Рассчитать длительность сессии в минутах
function calculateSessionDuration(session) {
    // Если есть дата/время закрытия, рассчитываем разницу
    if (session.shutdownDate && session.shutdownTime) {
        try {
            const start = new Date(`${session.activationDate}T${session.activationTime}`);
            const end = new Date(`${session.shutdownDate}T${session.shutdownTime}`);

            // Разница в миллисекундах
            const diffMs = end - start;

            // Преобразуем в минуты
            return Math.max(1, Math.round(diffMs / (1000 * 60)));
        } catch (error) {
            console.warn('Ошибка расчета времени сессии:', error);
        }
    }
    return 0;
}

// Отобразить статистику приложений
function displayAppStatistics(appStatsArray) {
    const tbody = document.getElementById('appStatsBody');

    let html = '';

    appStatsArray.forEach(stat => {
        const timeFormatted = formatTime(stat.totalMinutes);

        html += `
        <tr>
            <td title="${stat.appName}">${truncate(stat.appName, 20)}</td>
            <td style="text-align: center;">${stat.sessionCount}</td>
            <td style="text-align: right;">${timeFormatted}</td>
        </tr>
        `;
    });

    tbody.innerHTML = html;
}


// Загрузить таблицу сайтов
async function loadSiteTable(event) {
    document.querySelector('.site-active').style.display = 'flex';
    document.querySelector('.site-active-compact').style.display = 'none';
    const tbody = document.getElementById('siteTableBody');
    const btn = event?.target?.closest('.table-btn') || document.querySelector('.site-active .table-btn');

    try {
        tbody.innerHTML = '<tr><td colspan="7">Загрузка...</td></tr>';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳';
        }

        const response = await fetch('/api/sessions/page');
        const sessions = await response.json();

        if (!sessions || sessions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Нет данных</td></tr>';
            return;
        }

        // Сортируем новые сверху
        sessions.sort((a, b) => {
            const dateA = new Date(`${a.activationDate}T${a.activationTime}`);
            const dateB = new Date(`${b.activationDate}T${b.activationTime}`);
            return dateB - dateA;
        });

        // Отображаем все записи
        let html = '';
        sessions.forEach(session => {
            const siteDomain = session.site?.domain;
            const browserName = session.browser?.processName;

            const openTime = session.activationTime.substring(0, 5);
            const closeTime = session.shutdownTime ? session.shutdownTime.substring(0, 5) : '';

            html += `
            <tr>
                <td title="${siteDomain}">${truncate(siteDomain, 20)}</td>
                <td title="${browserName}">${truncate(browserName, 15)}</td>
                <td title="${session.pageTitle}">${truncate(session.pageTitle, 25)}</td>
                <td>${session.activationDate}</td>
                <td>${openTime}</td>
                <td>${session.shutdownDate || ''}</td>
                <td>${closeTime}</td>
            </tr>
            `;
        });

        tbody.innerHTML = html;

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }

        console.log(`Загружено ${sessions.length} сессий сайтов`);

    } catch (error) {
        console.error('Ошибка загрузки сайтов:', error);
        tbody.innerHTML = '<tr><td colspan="7">Ошибка загрузки</td></tr>';
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }
    }
}

// Загрузить статистику по времени сайтов
// Загрузить статистику по времени сайтов (все сайты, даже с нулевым временем)
async function loadSiteTimeStats(event) {
    document.querySelector('.site-time').style.display = 'flex';
    document.querySelector('.site-time-compact').style.display = 'none';
    const tbody = document.getElementById('siteStatsBody');
    const btn = event?.target?.closest('.table-btn') || document.querySelector('.site-time .table-btn');

    try {
        tbody.innerHTML = '<tr><td colspan="3">Загрузка...</td></tr>';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳';
        }

        // 1. Загружаем ВСЕ сайты
        const sitesResponse = await fetch('/api/sites');
        const allSites = await sitesResponse.json();

        // 2. Загружаем сессии сайтов
        const sessionsResponse = await fetch('/api/sessions/page');
        const sessions = await sessionsResponse.json();

        // 3. Создаем мапу для статистики
        const siteStatsMap = {};

        // 4. Инициализируем все сайты с нулевым временем
        allSites.forEach(site => {
            siteStatsMap[site.domain] = {
                siteName: site.domain,
                visitCount: 0,
                totalMinutes: 0
            };
        });

        // 5. Рассчитываем статистику по сессиям
        sessions.forEach(session => {
            const siteDomain = session.site?.domain;

            // Если сайт не в списке всех сайтов, добавляем его
            if (!siteStatsMap[siteDomain]) {
                siteStatsMap[siteDomain] = {
                    siteName: siteDomain,
                    visitCount: 0,
                    totalMinutes: 0
                };
            }

            siteStatsMap[siteDomain].visitCount++;

            // Рассчитываем время посещения
            if (session.shutdownDate && session.shutdownTime) {
                try {
                    const start = new Date(`${session.activationDate}T${session.activationTime}`);
                    const end = new Date(`${session.shutdownDate}T${session.shutdownTime}`);
                    const diffMs = end - start;
                    const minutes = Math.max(1, Math.round(diffMs / (1000 * 60)));
                    siteStatsMap[siteDomain].totalMinutes += minutes;
                } catch (error) {
                    siteStatsMap[siteDomain].totalMinutes += 5;
                }
            } else {
                siteStatsMap[siteDomain].totalMinutes += 5;
            }
        });

        // 6. Преобразуем в массив и сортируем
        const sortedStats = Object.values(siteStatsMap);

        // Сортируем по общему времени (убывание), потом по имени
        sortedStats.sort((a, b) => {
            if (b.totalMinutes !== a.totalMinutes) {
                return b.totalMinutes - a.totalMinutes;
            }
            return a.siteName.localeCompare(b.siteName);
        });

        // 7. Отображаем статистику
        let html = '';
        sortedStats.forEach(stat => {
            const siteDomain = session.site?.domain;
            const browserName = session.browser?.processName;

            const openTime = session.activationTime.substring(0, 5);
            const closeTime = session.shutdownTime;
            html += `
            <tr>
                <td title="${siteDomain}">${truncate(siteDomain, 20)}</td>
                <td title="${browserName}">${truncate(browserName, 15)}</td>
                <td title="${session.pageTitle}">${truncate(session.pageTitle, 25)}</td>
                <td>${session.activationDate}</td>
                <td>${openTime}</td>
                <td>${session.shutdownDate}</td>
                <td>${closeTime}</td>
            </tr>
            `;
        });

        tbody.innerHTML = html;

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }

        console.log(`Показано ${sortedStats.length} сайтов (все)`);

    } catch (error) {
        console.error('Ошибка загрузки статистики сайтов:', error);
        tbody.innerHTML = '<tr><td colspan="3">Ошибка загрузки</td></tr>';
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }
    }
}

// ============ YOUTUBE ============

// Загрузить таблицу YouTube
async function loadYouTubeTable(event) {
    document.querySelector('.youtube-active').style.display = 'flex';
    document.querySelector('.youtube-active-compact').style.display = 'none';
    const tbody = document.getElementById('youtubeTableBody');
    const btn = event?.target?.closest('.table-btn') || document.querySelector('.youtube-active .table-btn');

    try {
        tbody.innerHTML = '<tr><td colspan="7">Загрузка...</td></tr>';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳';
        }

        const response = await fetch('/api/sessions/view');
        const views = await response.json();

        if (!views || views.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Нет данных</td></tr>';
            return;
        }

        // Сортируем новые сверху
        views.sort((a, b) => {
            const dateA = new Date(`${a.activationDate}T${a.activationTime}`);
            const dateB = new Date(`${b.activationDate}T${b.activationTime}`);
            return dateB - dateA;
        });

        // Загружаем информацию о видео для отображения названий
        let html = '';
        for (const view of views) {
            const videoTitle = view.video?.title ;
            const videoAuthor = view.video?.author;
            const videoDuration = view.video?.videoDuration;

            const startTime = view.activationTime;
            const viewedTime = view.viewingTime;
            const siteDomain = view.site?.domain;

            const endTime = view.shutdownTime;
            const endViewedTime = view.shutdownDate;

            // Процент просмотра
            const percentViewed = videoDuration > 0 ? Math.round((viewedTime / videoDuration) * 100) : 0;

            html += `
            <tr>
                <td title="${videoTitle}">${truncate(videoTitle, 25)}</td>
                <td title="${videoAuthor}">${truncate(videoAuthor, 15)}</td>
                <td title="${siteDomain}">${truncate(siteDomain, 15)}</td>
                <td>${formatVideoTime(viewedTime)} (${percentViewed}%)</td>
                <td>${formatVideoTime(videoDuration)}</td>
                <td>${view.activationDate}</td>
                <td>${startTime}</td>
                <td>${endTime}</td>
                <td>${endViewedTime}</td>
            </tr>
            `;
        }

        tbody.innerHTML = html;

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }

        console.log(`Загружено ${views.length} просмотров YouTube`);

    } catch (error) {
        console.error('Ошибка загрузки YouTube:', error);
        tbody.innerHTML = '<tr><td colspan="7">Ошибка загрузки</td></tr>';
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🔄';
        }
    }
}







async function loadAppTableCompact(event) {
    document.querySelector('.app-active').style.display = 'none';
    document.querySelector('.app-active-compact').style.display = 'flex';
    const tbody = document.getElementById('appTableBodyCompact');

    try {
        tbody.innerHTML = '<tr><td colspan="6">Загрузка...</td></tr>';

        const response = await fetch('/api/sessions/app');
        const sessions = await response.json();

        if (!sessions || sessions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Нет данных</td></tr>';
            return;
        }

        // Сортируем новые сверху и берем только 5
        const top5Sessions = sessions.sort((a, b) => {
            const dateA = new Date(`${a.activationDate}T${a.activationTime}`);
            const dateB = new Date(`${b.activationDate}T${b.activationTime}`);
            return dateB - dateA;
        }).slice(0, 5);

        let html = '';
        top5Sessions.forEach(session => {
            const appName = session.app?.processName;
            const openTime = session.activationTime.substring(0, 5);
            const closeTime = session.shutdownTime ? session.shutdownTime.substring(0, 5) : '';

            html += `
            <tr>
                <td title="${appName}">${truncate(appName, 15)}</td>
                <td title="${session.windowTitle}">${truncate(session.windowTitle, 15)}</td>
                <td>${session.activationDate}</td>
                <td>${openTime}</td>
                <td>${session.shutdownDate || ''}</td>
                <td>${closeTime}</td>
            </tr>
            `;
        });

        tbody.innerHTML = html;
        console.log(`Загружено 5 последних сессий приложений (компакт)`);

    } catch (error) {
        console.error('Ошибка загрузки компактной таблицы:', error);
        tbody.innerHTML = '<tr><td colspan="6">Ошибка</td></tr>';
    }
}


async function loadAppTimeStatsCompact(event) {
    document.querySelector('.app-time').style.display = 'none';
    document.querySelector('.app-time-compact').style.display = 'flex';
    const tbody = document.getElementById('appStatsBodyCompact');

    try {
        tbody.innerHTML = '<tr><td colspan="3">Загрузка...</td></tr>';

        const response = await fetch('/api/sessions/app');
        const sessions = await response.json();

        if (!sessions || sessions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">Нет данных</td></tr>';
            return;
        }

        // Рассчитываем статистику
        const appStats = {};
        sessions.forEach(session => {
            const appName = session.app?.processName || 'Неизвестно';
            if (!appStats[appName]) {
                appStats[appName] = {
                    appName: appName,
                    sessionCount: 0,
                    totalMinutes: 0
                };
            }

            appStats[appName].sessionCount++;

            if (session.shutdownDate && session.shutdownTime) {
                try {
                    const start = new Date(`${session.activationDate}T${session.activationTime}`);
                    const end = new Date(`${session.shutdownDate}T${session.shutdownTime}`);
                    const diffMs = end - start;
                    const minutes = Math.max(1, Math.round(diffMs / (1000 * 60)));
                    appStats[appName].totalMinutes += minutes;
                } catch (error) {}
            }
        });

        // Сортируем и берем топ 5
        const top5 = Object.values(appStats)
            .sort((a, b) => b.totalMinutes - a.totalMinutes)
            .slice(0, 5);

        let html = '';
        top5.forEach(stat => {
            const timeFormatted = formatTime(stat.totalMinutes);
            html += `
            <tr>
                <td title="${stat.appName}">${truncate(stat.appName, 15)}</td>
                <td style="text-align: center;">${stat.sessionCount}</td>
                <td style="text-align: right;">${timeFormatted}</td>
            </tr>
            `;
        });

        tbody.innerHTML = html;
        console.log(`Загружено топ-5 статистики приложений (компакт)`);

    } catch (error) {
        console.error('Ошибка загрузки компактной статистики:', error);
        tbody.innerHTML = '<tr><td colspan="3">Ошибка</td></tr>';
    }
}


async function loadSiteTableCompact(event) {
    document.querySelector('.site-active').style.display = 'none';
    document.querySelector('.site-active-compact').style.display = 'flex';
    const tbody = document.getElementById('siteTableBodyCompact');

    try {
        tbody.innerHTML = '<tr><td colspan="5">Загрузка...</td></tr>';

        const response = await fetch('/api/sessions/page');
        const sessions = await response.json();

        if (!sessions || sessions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Нет данных</td></tr>';
            return;
        }

        // Сортируем новые сверху и берем только 5
        const top5Sessions = sessions.sort((a, b) => {
            const dateA = new Date(`${a.activationDate}T${a.activationTime}`);
            const dateB = new Date(`${b.activationDate}T${b.activationTime}`);
            return dateB - dateA;
        }).slice(0, 5);

        let html = '';
        top5Sessions.forEach(session => {
            const siteDomain = session.site?.domain;
            const openTime = session.activationTime.substring(0, 5);

            html += `
            <tr>
                <td title="${siteDomain}">${truncate(siteDomain, 15)}</td>
                <td title="${session.pageTitle}">${truncate(session.pageTitle, 15)}</td>
                <td>${session.activationDate}</td>
                <td>${openTime}</td>
                <td>${session.shutdownDate}</td>
                <td>${session.shutdownTime}</td>
            </tr>
            `;
        });

        tbody.innerHTML = html;
        console.log(`Загружено 5 последних сессий сайтов (компакт)`);

    } catch (error) {
        console.error('Ошибка загрузки компактной таблицы сайтов:', error);
        tbody.innerHTML = '<tr><td colspan="5">Ошибка</td></tr>';
    }
}

async function loadSiteTimeStatsCompact(event) {
    document.querySelector('.site-time').style.display = 'none';
    document.querySelector('.site-time-compact').style.display = 'flex';
    const tbody = document.getElementById('siteStatsBodyCompact');

    try {
        tbody.innerHTML = '<tr><td colspan="3">Загрузка...</td></tr>';

        // Загружаем ВСЕ сайты
        const sitesResponse = await fetch('/api/sites');
        const allSites = await sitesResponse.json();

        // Загружаем сессии сайтов
        const sessionsResponse = await fetch('/api/sessions/page');
        const sessions = await sessionsResponse.json();

        // Создаем мапу для статистики
        const siteStatsMap = {};

        // 1. Инициализируем все сайты с нулевым временем
        allSites.forEach(site => {
            siteStatsMap[site.domain] = {
                siteName: site.domain,
                visitCount: 0,
                totalMinutes: 0
            };
        });

        // 2. Рассчитываем статистику по сессиям
        sessions.forEach(session => {
            const siteDomain = session.site?.domain;

            // Если сайт не в списке всех сайтов, добавляем его
            if (!siteStatsMap[siteDomain]) {
                siteStatsMap[siteDomain] = {
                    siteName: siteDomain,
                    visitCount: 0,
                    totalMinutes: 0
                };
            }

            siteStatsMap[siteDomain].visitCount++;

            if (session.shutdownDate && session.shutdownTime) {
                try {
                    const start = new Date(`${session.activationDate}T${session.activationTime}`);
                    const end = new Date(`${session.shutdownDate}T${session.shutdownTime}`);
                    const diffMs = end - start;
                    const minutes = Math.max(1, Math.round(diffMs / (1000 * 60)));
                    siteStatsMap[siteDomain].totalMinutes += minutes;
                } catch (error) {
                    siteStatsMap[siteDomain].totalMinutes += 0;
                }
            } else {
                siteStatsMap[siteDomain].totalMinutes += 0;
            }
        });

        // 3. Преобразуем в массив и сортируем
        const sortedStats = Object.values(siteStatsMap);

        // Сортируем по общему времени (убывание), потом по имени
        sortedStats.sort((a, b) => {
            if (b.totalMinutes !== a.totalMinutes) {
                return b.totalMinutes - a.totalMinutes;
            }
            return a.siteName.localeCompare(b.siteName);
        });

        // 4. Берем топ 5
        const top5 = sortedStats.slice(0, 5);

        // 5. Отображаем статистику
        let html = '';
        top5.forEach(stat => {
            const timeFormatted = formatTime(stat.totalMinutes);
            html += `
            <tr>
                <td title="${stat.siteName}">${truncate(stat.siteName, 15)}</td>
                <td style="text-align: center;">${stat.visitCount}</td>
                <td style="text-align: right;">${timeFormatted}</td>
            </tr>
            `;
        });

        tbody.innerHTML = html;

    } catch (error) {
        console.error('Ошибка загрузки компактной статистики сайтов:', error);
        tbody.innerHTML = '<tr><td colspan="3">Ошибка</td></tr>';
    }
}

async function loadYouTubeTableCompact(event) {
    document.querySelector('.youtube-active').style.display = 'none';
    document.querySelector('.youtube-active-compact').style.display = 'flex';
    const tbody = document.getElementById('youtubeTableBodyCompact');

    try {
        tbody.innerHTML = '<tr><td colspan="7">Загрузка...</td></tr>';

        const response = await fetch('/api/sessions/view');
        const views = await response.json();

        if (!views || views.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Нет данных</td></tr>';
            return;
        }

        // Сортируем новые сверху и берем только 5
        const top5Views = views.sort((a, b) => {
            const dateA = new Date(`${a.activationDate}T${a.activationTime}`);
            const dateB = new Date(`${b.activationDate}T${b.activationTime}`);
            return dateB - dateA;
        }).slice(0, 5);

        let html = '';
        top5Views.forEach(view => {
             const videoTitle = view.video?.title ;
             const videoAuthor = view.video?.author;
             const videoDuration = view.video?.videoDuration;

             const startTime = view.activationTime;
             const viewedTime = view.viewingTime;
             const siteDomain = view.site?.domain;

             const endTime = view.shutdownTime;
             const endViewedTime = view.shutdownDate;

             // Процент просмотра
             const percentViewed = videoDuration > 0 ? Math.round((viewedTime / videoDuration) * 100) : 0;

             html += `
             <tr>
                 <td title="${videoTitle}">${truncate(videoTitle, 25)}</td>
                 <td title="${videoAuthor}">${truncate(videoAuthor, 15)}</td>
                 <td title="${siteDomain}">${truncate(siteDomain, 15)}</td>
                 <td>${formatVideoTime(viewedTime)} (${percentViewed}%)</td>
                 <td>${formatVideoTime(videoDuration)}</td>
                 <td>${view.activationDate}</td>
                 <td>${startTime}</td>
                 <td>${endTime}</td>
                 <td>${endViewedTime}</td>
             </tr>
             `;

        });

        tbody.innerHTML = html;
        console.log(`Загружено 5 последних записей YouTube (компакт)`);

    } catch (error) {
        console.error('Ошибка загрузки компактной таблицы YouTube:', error);
        tbody.innerHTML = '<tr><td colspan="7">Ошибка</td></tr>';
    }
}



// ============ ИНИЦИАЛИЗАЦИЯ ============

document.addEventListener('DOMContentLoaded', function(event) {
    console.log('Страница загружена, инициализация...');

    // Инициализируем модальное окно
    if (typeof initModalHandlers === 'function') {
        initModalHandlers();
    }


    // Загружаем все данные
    loadAppTable();
    loadAppTimeStats();
    loadSiteTable();
    loadSiteTimeStats();
    loadYouTubeTable();


    console.log('Все блоки инициализированы');
});

// ============ ЭКСПОРТ ФУНКЦИЙ ============

window.loadAppTable = loadAppTable;
window.loadAppTimeStats = loadAppTimeStats;
window.loadSiteTable = loadSiteTable;
window.loadSiteTimeStats = loadSiteTimeStats;
window.loadYouTubeTable = loadYouTubeTable;
window.toggleCompactTable = toggleCompactTable;
window.loadAppTableCompact = loadAppTableCompact;
window.loadAppTimeStatsCompact = loadAppTimeStatsCompact;
window.loadSiteTableCompact = loadSiteTableCompact;
window.loadSiteTimeStatsCompact = loadSiteTimeStatsCompact;
window.loadYouTubeTableCompact = loadYouTubeTableCompact;








