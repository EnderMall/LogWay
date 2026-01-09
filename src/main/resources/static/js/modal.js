
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
                           class="form-input" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label for="page_activation_time">Время открытия</label>
                    <input type="time" id="page_activation_time" name="activation_time"
                           class="form-input" value="${new Date().toTimeString().substring(0,5)}" required>
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
                           placeholder="youtube.com" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="viewing_time">Время просмотра (сек)</label>
                    <input type="number" id="viewing_time" name="viewing_time"
                           placeholder="300" class="form-input" required min="1">
                </div>
                <div class="form-group">
                    <label for="view_activation_date">Дата начала просмотра</label>
                    <input type="date" id="view_activation_date" name="activation_date"
                           class="form-input" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label for="view_activation_time">Время начала просмотра</label>
                    <input type="time" id="view_activation_time" name="activation_time"
                           class="form-input" value="${new Date().toTimeString().substring(0,5)}" required>
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
               <td title="${appName}">${appName}</td>
               <td title="${session.windowTitle}">${session.windowTitle}</td>
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


        const appsResponse = await fetch('/api/apps');
        const allApps = await appsResponse.json();


        const sessionsResponse = await fetch('/api/sessions/app');
        const sessions = await sessionsResponse.json();


        const appStatsMap = {};


        allApps.forEach(app => {
            appStatsMap[app.processName] = {
                appName: app.processName,
                baseName: app.baseName || app.processName,
                sessionCount: 0,
                totalMinutes: 0
            };
        });


        sessions.forEach(session => {
            const appName = session.app?.processName;


            if (!appStatsMap[appName]) {
                appStatsMap[appName] = {
                    appName: appName,
                    baseName: session.app?.baseName || appName,
                    sessionCount: 0,
                    totalMinutes: 0
                };
            }


            appStatsMap[appName].sessionCount++;


            const sessionMinutes = calculateSessionDuration(session);
            appStatsMap[appName].totalMinutes += sessionMinutes;
        });


        const appStatsArray = Object.values(appStatsMap);


        appStatsArray.sort((a, b) => {
            if (b.totalMinutes !== a.totalMinutes) {
                return b.totalMinutes - a.totalMinutes;
            }
            return a.appName.localeCompare(b.appName);
        });


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


function calculateAppStatistics(sessions) {
    const appStats = {};

    sessions.forEach(session => {
        const appName = session.app?.processName;


        if (!appStats[appName]) {
            appStats[appName] = {
                appName: appName,
                sessionCount: 0,
                totalMinutes: 0
            };
        }


        appStats[appName].sessionCount++;


        const sessionMinutes = calculateSessionDuration(session);
        appStats[appName].totalMinutes += sessionMinutes;
    });

    return appStats;
}


function calculateSessionDuration(session) {

    if (session.shutdownDate && session.shutdownTime) {
        try {
            const start = new Date(`${session.activationDate}T${session.activationTime}`);
            const end = new Date(`${session.shutdownDate}T${session.shutdownTime}`);


            const diffMs = end - start;


            return Math.max(1, Math.round(diffMs / (1000 * 60)));
        } catch (error) {
            console.warn('Ошибка расчета времени сессии:', error);
        }
    }
    return 0;
}


function displayAppStatistics(appStatsArray) {
    const tbody = document.getElementById('appStatsBody');

    let html = '';

    appStatsArray.forEach(stat => {
        const timeFormatted = formatTime(stat.totalMinutes);

        html += `
        <tr>
            <td title="${stat.appName}">${stat.appName}</td>
            <td style="text-align: center;">${stat.sessionCount}</td>
            <td style="text-align: right;">${timeFormatted}</td>
        </tr>
        `;
    });

    tbody.innerHTML = html;
}



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


        sessions.sort((a, b) => {
            const dateA = new Date(`${a.activationDate}T${a.activationTime}`);
            const dateB = new Date(`${b.activationDate}T${b.activationTime}`);
            return dateB - dateA;
        });


        let html = '';
        sessions.forEach(session => {
            const siteDomain = session.site?.domain;
            const browserName = session.browser?.processName;

            const openTime = session.activationTime.substring(0, 5);
            const closeTime = session.shutdownTime ? session.shutdownTime.substring(0, 5) : '';

            html += `
            <tr>
                <td title="${siteDomain}">${siteDomain}</td>
                <td title="${session.pageTitle}">${session.pageTitle}</td>
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

        const sitesResponse = await fetch('/api/sites');
        const allSites = await sitesResponse.json();

        const sessionsResponse = await fetch('/api/sessions/page');
        const sessions = await sessionsResponse.json();

        const siteStatsMap = {};

        allSites.forEach(site => {
            siteStatsMap[site.domain] = {
                siteName: site.domain,
                visitCount: 0,
                totalMinutes: 0
            };
        });

        sessions.forEach(session => {
            const siteDomain = session.site?.domain;

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
                    siteStatsMap[siteDomain].totalMinutes += 5;
                }
            } else {
                siteStatsMap[siteDomain].totalMinutes += 5;
            }
        });

        const sortedStats = Object.values(siteStatsMap);

        sortedStats.sort((a, b) => {
            if (b.totalMinutes !== a.totalMinutes) {
                return b.totalMinutes - a.totalMinutes;
            }
            return a.siteName.localeCompare(b.siteName);
        });

        let html = '';
        sortedStats.forEach(stat => {
            const siteName = stat.siteName;
            const visitCount = stat.visitCount;
            const totalMinutes = stat.totalMinutes;

            html += `
            <tr>
                <td title="${siteName}">${siteName}</td>
                <td>${visitCount}</td>
                <td>${totalMinutes}</td>
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


        views.sort((a, b) => {
            const dateA = new Date(`${a.activationDate}T${a.activationTime}`);
            const dateB = new Date(`${b.activationDate}T${b.activationTime}`);
            return dateB - dateA;
        });


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


            const percentViewed = videoDuration > 0 ? Math.round((viewedTime / videoDuration) * 100) : 0;

            html += `
            <tr>
                <td title="${videoTitle}">${videoTitle}</td>
                <td title="${videoAuthor}">${videoAuthor}</td>
                <td title="${siteDomain}">${siteDomain}</td>
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
                <td title="${appName}">${appName}</td>
                <td title="${session.windowTitle}">${session.windowTitle}</td>
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


        const top5 = Object.values(appStats)
            .sort((a, b) => b.totalMinutes - a.totalMinutes)
            .slice(0, 5);

        let html = '';
        top5.forEach(stat => {
            const timeFormatted = formatTime(stat.totalMinutes);
            html += `
            <tr>
                <td title="${stat.appName}">${stat.appName}</td>
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
                <td title="${siteDomain}">${siteDomain}</td>
                <td title="${session.pageTitle}">${session.pageTitle}</td>
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


        const sitesResponse = await fetch('/api/sites');
        const allSites = await sitesResponse.json();


        const sessionsResponse = await fetch('/api/sessions/page');
        const sessions = await sessionsResponse.json();


        const siteStatsMap = {};

        allSites.forEach(site => {
            siteStatsMap[site.domain] = {
                siteName: site.domain,
                visitCount: 0,
                totalMinutes: 0
            };
        });


        sessions.forEach(session => {
            const siteDomain = session.site?.domain;


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


        const sortedStats = Object.values(siteStatsMap);


        sortedStats.sort((a, b) => {
            if (b.totalMinutes !== a.totalMinutes) {
                return b.totalMinutes - a.totalMinutes;
            }
            return a.siteName.localeCompare(b.siteName);
        });

        const top5 = sortedStats.slice(0, 5);


        let html = '';
        top5.forEach(stat => {
            const timeFormatted = formatTime(stat.totalMinutes);
            html += `
            <tr>
                <td title="${stat.siteName}">${stat.siteName}</td>
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


             const percentViewed = videoDuration > 0 ? Math.round((viewedTime / videoDuration) * 100) : 0;

             html += `
             <tr>
                 <td title="${videoTitle}">${videoTitle}</td>
                 <td title="${videoAuthor}">${videoAuthor}</td>
                 <td title="${siteDomain}">${siteDomain}</td>
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


async function addTemplateData() {
    if (!confirm('Добавить шаблонные данные? Это создаст тестовые записи.')) {
        return;
    }

    const originalText = document.querySelector('#openModal1 h4').textContent;
    document.querySelector('#openModal1 h4').textContent = 'Добавление...';

    try {

        const apps = [
            { processName: 'chrome.exe', baseName: 'Google Chrome' },
            { processName: 'firefox.exe', baseName: 'Mozilla Firefox' },
            { processName: 'msedge.exe', baseName: 'Microsoft Edge' },
            { processName: 'code.exe', baseName: 'Visual Studio Code' },
            { processName: 'telegram.exe', baseName: 'Telegram' },
            { processName: 'notepad.exe', baseName: 'Блокнот' },
            { processName: 'explorer.exe', baseName: 'Проводник Windows' },
            { processName: 'pycharm.exe', baseName: 'PyCharm' },
            { processName: 'spotify.exe', baseName: 'Spotify' }
        ];

        for (const app of apps) {
            await fetch('/api/apps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(app)
            });
        }


        const sites = [
            { domain: 'youtube.com' },
            { domain: 'google.com' },
            { domain: 'github.com' },
            { domain: 'stackoverflow.com' },
            { domain: 'vk.com' },
            { domain: 'habr.com' },
            { domain: 'reddit.com' }
        ];

        for (const site of sites) {
            await fetch('/api/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(site)
            });
        }


        const videos = [
            { videoId: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', author: 'Rick Astley', videoDuration: 213 },
            { videoId: 'jNQXAC9IVRw', title: 'Me at the zoo', author: 'jawed', videoDuration: 19 },
            { videoId: '9bZkp7q19f0', title: 'Gangnam Style', author: 'psy', videoDuration: 252 },
            { videoId: 'kJQP7kiw5Fk', title: 'Despacito', author: 'Luis Fonsi', videoDuration: 282 },
            { videoId: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', author: 'Queen Official', videoDuration: 354 },
            { videoId: 'LeAltgu_pbM', title: 'Learn SQL in 1 Hour', author: 'Programming Guru', videoDuration: 3725 },
            { videoId: 'hY7m5jjJ9mM', title: 'CATS will make you LAUGH', author: 'Funny Cats Compilation', videoDuration: 486 }
        ];

        for (const video of videos) {
            await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(video)
            });
        }


        const appSessions = [

            { activationDate: '2025-11-16', activationTime: '09:00:00', shutdownDate: '2025-11-16', shutdownTime: '12:30:00', app: { processName: 'chrome.exe' }, windowTitle: 'Google Chrome' },
            { activationDate: '2025-11-16', activationTime: '10:15:00', shutdownDate: '2025-11-16', shutdownTime: '11:45:00', app: { processName: 'code.exe' }, windowTitle: 'project.py - Visual Studio Code' },
            { activationDate: '2025-11-16', activationTime: '14:00:00', shutdownDate: '2025-11-16', shutdownTime: '18:20:00', app: { processName: 'chrome.exe' }, windowTitle: 'YouTube' },
            { activationDate: '2025-11-16', activationTime: '16:30:00', shutdownDate: '2025-11-16', shutdownTime: '17:00:00', app: { processName: 'telegram.exe' }, windowTitle: 'Telegram' },
            { activationDate: '2025-11-16', activationTime: '19:00:00', shutdownDate: '2025-11-16', shutdownTime: '22:00:00', app: { processName: 'chrome.exe' }, windowTitle: 'GitHub' },


            { activationDate: '2025-11-15', activationTime: '08:45:00', shutdownDate: '2025-11-15', shutdownTime: '17:30:00', app: { processName: 'chrome.exe' }, windowTitle: 'Google Chrome' },
            { activationDate: '2025-11-15', activationTime: '09:30:00', shutdownDate: '2025-11-15', shutdownTime: '16:45:00', app: { processName: 'code.exe' }, windowTitle: 'database.sql - Visual Studio Code' },
            { activationDate: '2025-11-15', activationTime: '13:00:00', shutdownDate: '2025-11-15', shutdownTime: '14:30:00', app: { processName: 'spotify.exe' }, windowTitle: 'Spotify' },
            { activationDate: '2025-11-15', activationTime: '19:00:00', shutdownDate: '2025-11-15', shutdownTime: '22:15:00', app: { processName: 'chrome.exe' }, windowTitle: 'YouTube' },
            { activationDate: '2025-11-15', activationTime: '20:00:00', shutdownDate: '2025-11-15', shutdownTime: '21:30:00', app: { processName: 'pycharm.exe' }, windowTitle: 'PyCharm' },


            { activationDate: '2025-11-14', activationTime: '10:00:00', shutdownDate: '2025-11-14', shutdownTime: '18:00:00', app: { processName: 'chrome.exe' }, windowTitle: 'Google Chrome' },
            { activationDate: '2025-11-13', activationTime: '11:00:00', shutdownDate: '2025-11-13', shutdownTime: '17:00:00', app: { processName: 'code.exe' }, windowTitle: 'main.py - Visual Studio Code' },
            { activationDate: '2025-11-12', activationTime: '09:30:00', shutdownDate: '2025-11-12', shutdownTime: '15:45:00', app: { processName: 'msedge.exe' }, windowTitle: 'Microsoft Edge' },
            { activationDate: '2025-11-11', activationTime: '14:00:00', shutdownDate: '2025-11-11', shutdownTime: '16:30:00', app: { processName: 'pycharm.exe' }, windowTitle: 'PyCharm' },
            { activationDate: '2025-11-10', activationTime: '08:00:00', shutdownDate: '2025-11-10', shutdownTime: '19:00:00', app: { processName: 'chrome.exe' }, windowTitle: 'Работа' }
        ];

        for (const session of appSessions) {
            await fetch('/api/sessions/app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session)
            });
        }


        const viewSessions = [

            { activationDate: '2025-11-16', activationTime: '14:05:00', shutdownDate: '2025-11-16', shutdownTime: '14:08:00', video: { videoId: 'jNQXAC9IVRw' }, viewingTime: 180, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-16', activationTime: '14:15:00', shutdownDate: '2025-11-16', shutdownTime: '14:20:00', video: { videoId: 'fJ9rUzIMcZQ' }, viewingTime: 300, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-16', activationTime: '16:45:00', shutdownDate: '2025-11-16', shutdownTime: '17:50:00', video: { videoId: 'LeAltgu_pbM' }, viewingTime: 3900, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-16', activationTime: '21:00:00', shutdownDate: '2025-11-16', shutdownTime: '21:45:00', video: { videoId: 'hY7m5jjJ9mM' }, viewingTime: 2700, site: { domain: 'youtube.com' } },


            { activationDate: '2025-11-15', activationTime: '19:30:00', shutdownDate: '2025-11-15', shutdownTime: '19:35:00', video: { videoId: 'dQw4w9WgXcQ' }, viewingTime: 213, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-15', activationTime: '20:00:00', shutdownDate: '2025-11-15', shutdownTime: '20:12:00', video: { videoId: '9bZkp7q19f0' }, viewingTime: 720, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-15', activationTime: '21:00:00', shutdownDate: '2025-11-15', shutdownTime: '21:48:00', video: { videoId: 'kJQP7kiw5Fk' }, viewingTime: 2880, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-15', activationTime: '22:00:00', shutdownDate: '2025-11-15', shutdownTime: '22:30:00', video: { videoId: 'fJ9rUzIMcZQ' }, viewingTime: 1800, site: { domain: 'youtube.com' } },


            { activationDate: '2025-11-14', activationTime: '15:00:00', shutdownDate: '2025-11-14', shutdownTime: '16:05:00', video: { videoId: 'LeAltgu_pbM' }, viewingTime: 3900, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-13', activationTime: '16:00:00', shutdownDate: '2025-11-13', shutdownTime: '16:45:00', video: { videoId: 'hY7m5jjJ9mM' }, viewingTime: 2700, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-12', activationTime: '13:00:00', shutdownDate: '2025-11-12', shutdownTime: '14:30:00', video: { videoId: 'LeAltgu_pbM' }, viewingTime: 5400, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-11', activationTime: '18:00:00', shutdownDate: '2025-11-11', shutdownTime: '19:15:00', video: { videoId: 'fJ9rUzIMcZQ' }, viewingTime: 4500, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-10', activationTime: '20:00:00', shutdownDate: '2025-11-10', shutdownTime: '20:40:00', video: { videoId: '9bZkp7q19f0' }, viewingTime: 2400, site: { domain: 'youtube.com' } },
            { activationDate: '2025-11-09', activationTime: '17:00:00', shutdownDate: '2025-11-09', shutdownTime: '17:55:00', video: { videoId: 'kJQP7kiw5Fk' }, viewingTime: 3300, site: { domain: 'youtube.com' } },
            { activationDate: '2025-10-20', activationTime: '19:00:00', shutdownDate: '2025-10-20', shutdownTime: '20:10:00', video: { videoId: 'LeAltgu_pbM' }, viewingTime: 4200, site: { domain: 'youtube.com' } }
        ];

        for (const session of viewSessions) {
            await fetch('/api/sessions/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session)
            });
        }


        const pageSessions = [
            { activationDate: '2025-11-16', activationTime: '09:05:00', shutdownDate: '2025-11-16', shutdownTime: '09:15:00', site: { domain: 'google.com' }, pageTitle: 'Google', browser: { processName: 'chrome.exe' } },
            { activationDate: '2025-11-16', activationTime: '09:20:00', shutdownDate: '2025-11-16', shutdownTime: '10:00:00', site: { domain: 'stackoverflow.com' }, pageTitle: 'SQL questions - Stack Overflow', browser: { processName: 'chrome.exe' } },
            { activationDate: '2025-11-16', activationTime: '14:10:00', shutdownDate: '2025-11-16', shutdownTime: '14:30:00', site: { domain: 'github.com' }, pageTitle: 'GitHub', browser: { processName: 'chrome.exe' } },
            { activationDate: '2025-11-15', activationTime: '10:00:00', shutdownDate: '2025-11-15', shutdownTime: '10:30:00', site: { domain: 'habr.com' }, pageTitle: 'Habr', browser: { processName: 'chrome.exe' } },
            { activationDate: '2025-11-14', activationTime: '11:00:00', shutdownDate: '2025-11-14', shutdownTime: '11:45:00', site: { domain: 'reddit.com' }, pageTitle: 'Reddit', browser: { processName: 'msedge.exe' } },
            { activationDate: '2025-11-13', activationTime: '12:00:00', shutdownDate: '2025-11-13', shutdownTime: '13:00:00', site: { domain: 'vk.com' }, pageTitle: 'VK', browser: { processName: 'chrome.exe' } }
        ];

        for (const session of pageSessions) {
            await fetch('/api/sessions/page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session)
            });
        }



        if (typeof loadAppTable === 'function') loadAppTable();
        if (typeof loadSiteTable === 'function') loadSiteTable();
        if (typeof loadYouTubeTable === 'function') loadYouTubeTable();
        if (typeof loadAppTimeStats === 'function') loadAppTimeStats();
        if (typeof loadSiteTimeStats === 'function') loadSiteTimeStats();

    } catch (error) {
        console.error('Ошибка при добавлении данных:', error);
        alert('❌ Ошибка: ' + error.message);
    } finally {
        document.querySelector('#openModal1 h4').textContent = originalText;
    }
}





document.addEventListener('DOMContentLoaded', function(event) {
    console.log('Страница загружена, инициализация...');
    const addTemplateBtn = document.getElementById('openModal1');

    if (addTemplateBtn) {
        addTemplateBtn.addEventListener('click', addTemplateData);
    }
    if (typeof initModalHandlers === 'function') {
        initModalHandlers();
    }



    loadAppTable();
    loadAppTimeStats();
    loadSiteTable();
    loadSiteTimeStats();
    loadYouTubeTable();


    console.log('Все блоки инициализированы');
});


document.addEventListener('DOMContentLoaded', function() {
    const openDeleteModalBtn = document.getElementById('openDeleteModal');
    const deleteCancelBtn = document.getElementById('deleteCancelBtn');
    const deleteModal = document.getElementById('deleteModal');
    const tableSelect = document.getElementById('deleteTableSelect');
    const idInput = document.getElementById('idInput');
    const deleteBtn = document.getElementById('deleteBtn');
    const deletePreview = document.getElementById('deletePreview');
    const previewText = document.getElementById('previewText');
    const generalWarning = document.getElementById('generalWarning');

    // Открытие модального окна
    if (openDeleteModalBtn) {
        openDeleteModalBtn.addEventListener('click', function() {
            deleteModal.style.display = 'flex';
            // Сброс формы
            if (tableSelect) tableSelect.value = '';
            if (idInput) idInput.value = '';
            updateDeleteUI();
        });
    }

    // Закрытие модального окна
    if (deleteCancelBtn) {
        deleteCancelBtn.addEventListener('click', function() {
            deleteModal.style.display = 'none';
        });
    }

    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });

    // Слушатель изменения таблицы
    if (tableSelect) {
        tableSelect.addEventListener('change', function() {
            updateDeleteUI();
        });
    }

    // Слушатель изменения ID
    if (idInput) {
        idInput.addEventListener('input', function() {
            updateDeleteUI();
        });
    }

    // Кнопка удаления
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async function() {
            const selectedTable = tableSelect ? tableSelect.value : '';
            const id = idInput ? idInput.value.trim() : '';

            if (!selectedTable) {
                alert('❌ Пожалуйста, выберите таблицу!');
                return;
            }

            // Получаем тип операции
            const operationType = getOperationType(selectedTable, id);
            const confirmMessage = getConfirmMessage(selectedTable, id, operationType);

            if (!confirm(confirmMessage)) {
                return;
            }

            // Блокируем кнопку
            deleteBtn.textContent = 'Удаление...';
            deleteBtn.disabled = true;

            try {
                const result = await performDelete(selectedTable, id, operationType);
                alert(result.success ? '✅ ' + result.message : '❌ ' + result.message);

                if (result.success) {
                    deleteModal.style.display = 'none';
                    // Обновляем страницу если нужно
                    if (selectedTable.includes('_sessions')) {
                        setTimeout(() => location.reload(), 1000);
                    }
                }
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('❌ Ошибка: ' + (error.message || 'Неизвестная ошибка'));
            } finally {
                deleteBtn.textContent = 'Удалить';
                deleteBtn.disabled = false;
            }
        });
    }
});

// Определяем тип операции
function getOperationType(selectedTable, id) {
    if (selectedTable === 'ALL_TABLES') return 'ALL_TABLES';
    if (!id) return 'ALL_FROM_TABLE';
    return 'SINGLE_RECORD';
}

// Получаем сообщение для подтверждения
function getConfirmMessage(selectedTable, id, operationType) {
    const tableNames = {
        'apps': 'Приложения',
        'sites': 'Сайты',
        'videos': 'Видео',
        'app_sessions': 'Сессии приложений',
        'page_sessions': 'Сессии страниц',
        'view_sessions': 'Сессии просмотров',
        'ALL_TABLES': 'ВСЕ ТАБЛИЦЫ'
    };

    switch(operationType) {
        case 'ALL_TABLES':
            return `⚠️ ВНИМАНИЕ!\n\nВы собираетесь удалить ВСЕ данные из ВСЕХ таблиц:\n` +
                   `• Все приложения\n• Все сайты\n• Все видео\n` +
                   `• Все сессии приложений\n• Все сессии страниц\n• Все сессии просмотров\n\n` +
                   `Это действие НЕОБРАТИМО!\n\nПродолжить?`;

        case 'ALL_FROM_TABLE':
            return `Вы собираетесь удалить ВСЕ записи из таблицы "${tableNames[selectedTable]}".\n\n` +
                   `Это действие НЕОБРАТИМО!\n\nПродолжить?`;

        case 'SINGLE_RECORD':
            return `Удалить запись с ID "${id}" из таблицы "${tableNames[selectedTable]}"?`;

        default:
            return 'Вы уверены?';
    }
}

// Обновление UI
function updateDeleteUI() {
    const tableSelect = document.getElementById('deleteTableSelect');
    const idInput = document.getElementById('idInput');
    const deleteSpecificSection = document.getElementById('deleteSpecificSection');
    const deleteAllSection = document.getElementById('deleteAllSection');
    const generalWarning = document.getElementById('generalWarning');
    const deleteBtn = document.getElementById('deleteBtn');
    const deletePreview = document.getElementById('deletePreview');

    const selectedValue = tableSelect ? tableSelect.value : '';
    const id = idInput ? idInput.value.trim() : '';

    // Показываем/скрываем секции
    if (selectedValue === 'ALL_TABLES') {
        deleteSpecificSection.style.display = 'none';
        deleteAllSection.style.display = 'block';
        if (generalWarning) generalWarning.style.display = 'block';
        if (deleteBtn) deleteBtn.disabled = false;
        if (deletePreview) deletePreview.style.display = 'none';
    } else if (selectedValue) {
        deleteSpecificSection.style.display = 'block';
        deleteAllSection.style.display = 'none';

        // Устанавливаем подсказку в placeholder
        if (idInput) {
            const placeholders = {
                'app_sessions': 'Введите ID сессии (число)',
                'page_sessions': 'Введите ID сессии (число)',
                'view_sessions': 'Введите ID сессии (число)',
                'apps': 'Введите имя процесса (chrome.exe)',
                'sites': 'Введите домен (youtube.com)',
                'videos': 'Введите ID видео (dQw4w9WgXcQ)'
            };
            idInput.placeholder = placeholders[selectedValue] || 'Введите ID';
        }

        if (generalWarning) {
            generalWarning.style.display = id ? 'none' : 'block';
        }

        if (deleteBtn) {
            deleteBtn.disabled = false;
        }

        // Обновляем предпросмотр
        updateDeletePreview(selectedValue, id);
    } else {
        deleteSpecificSection.style.display = 'none';
        deleteAllSection.style.display = 'none';
        if (generalWarning) generalWarning.style.display = 'none';
        if (deleteBtn) deleteBtn.disabled = true;
        if (deletePreview) deletePreview.style.display = 'none';
    }
}

// Обновление предпросмотра удаления
async function updateDeletePreview(tableName, id) {
    const deletePreview = document.getElementById('deletePreview');
    const previewText = document.getElementById('previewText');

    if (!deletePreview || !previewText) return;

    if (!tableName || tableName === 'ALL_TABLES') {
        deletePreview.style.display = 'none';
        return;
    }

    try {
        if (!id) {
            // Предпросмотр удаления ВСЕХ записей из таблицы
            const count = await getRecordCount(tableName);
            previewText.innerHTML = `
                <strong>Будет удалено: ${count} записей</strong><br>
                <small>Из таблицы: ${tableName}</small>
            `;
            deletePreview.style.display = 'block';
        } else {
            // Предпросмотр удаления конкретной записи
            const record = await getRecordInfo(tableName, id);
            if (record) {
                previewText.innerHTML = `
                    <strong>Будет удалена 1 запись:</strong><br>
                    <small>ID: ${id}</small><br>
                    <pre style="font-size: 12px; margin-top: 10px;">${JSON.stringify(record, null, 2)}</pre>
                `;
            } else {
                previewText.innerHTML = `❌ Запись с ID "${id}" не найдена`;
            }
            deletePreview.style.display = 'block';
        }
    } catch (error) {
        previewText.innerHTML = '⚠️ Не удалось загрузить информацию';
        deletePreview.style.display = 'block';
    }
}

// Получение количества записей
async function getRecordCount(tableName) {
    try {
        let endpoint;
        switch(tableName) {
            case 'app_sessions': endpoint = '/api/sessions/app'; break;
            case 'page_sessions': endpoint = '/api/sessions/page'; break;
            case 'view_sessions': endpoint = '/api/sessions/view'; break;
            case 'apps': endpoint = '/api/apps'; break;
            case 'sites': endpoint = '/api/sites'; break;
            case 'videos': endpoint = '/api/videos'; break;
            default: return 0;
        }

        const response = await fetch(endpoint);
        if (response.ok) {
            const data = await response.json();
            return data.length;
        }
        return 0;
    } catch (error) {
        console.error('Ошибка получения количества записей:', error);
        return 0;
    }
}

// Получение информации о записи
async function getRecordInfo(tableName, id) {
    try {
        let endpoint;
        switch(tableName) {
            case 'app_sessions': endpoint = `/api/sessions/app/${id}`; break;
            case 'page_sessions': endpoint = `/api/sessions/page/${id}`; break;
            case 'view_sessions': endpoint = `/api/sessions/view/${id}`; break;
            case 'apps': endpoint = `/api/apps/${id}`; break;
            case 'sites': endpoint = `/api/sites/${id}`; break;
            case 'videos': endpoint = `/api/videos/${id}`; break;
            default: return null;
        }

        const response = await fetch(endpoint);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Ошибка получения информации о записи:', error);
        return null;
    }
}

// Выполнение удаления
async function performDelete(tableName, id, operationType) {
    try {
        switch(operationType) {
            case 'ALL_TABLES':
                await clearAllTables();
                return {
                    success: true,
                    message: 'Все таблицы успешно очищены'
                };

            case 'ALL_FROM_TABLE':
                await clearTable(tableName);
                return {
                    success: true,
                    message: `Все записи удалены из таблицы ${tableName}`
                };

            case 'SINGLE_RECORD':
                await deleteSingleRecord(tableName, id);
                return {
                    success: true,
                    message: `Запись "${id}" удалена из таблицы ${tableName}`
                };

            default:
                throw new Error('Неизвестный тип операции');
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Ошибка при удалении'
        };
    }
}

// Удаление одной записи
async function deleteSingleRecord(tableName, id) {
    let endpoint;

    switch(tableName) {
        case 'app_sessions': endpoint = `/api/sessions/app/${id}`; break;
        case 'page_sessions': endpoint = `/api/sessions/page/${id}`; break;
        case 'view_sessions': endpoint = `/api/sessions/view/${id}`; break;
        case 'apps': endpoint = `/api/apps/${id}`; break;
        case 'sites': endpoint = `/api/sites/${id}`; break;
        case 'videos': endpoint = `/api/videos/${id}`; break;
        default: throw new Error(`Неизвестная таблица: ${tableName}`);
    }

    const response = await fetch(endpoint, { method: 'DELETE' });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка ${response.status}`);
    }
}

// Очистка всей таблицы
async function clearTable(tableName) {
    try {
        switch(tableName) {
            case 'view_sessions':
                const viewSessions = await fetch('/api/sessions/view').then(r => r.json());
                for (const session of viewSessions) {
                    await fetch(`/api/sessions/view/${session.id}`, { method: 'DELETE' });
                }
                break;

            case 'page_sessions':
                const pageSessions = await fetch('/api/sessions/page').then(r => r.json());
                for (const session of pageSessions) {
                    await fetch(`/api/sessions/page/${session.id}`, { method: 'DELETE' });
                }
                break;

            case 'app_sessions':
                const appSessions = await fetch('/api/sessions/app').then(r => r.json());
                for (const session of appSessions) {
                    await fetch(`/api/sessions/app/${session.id}`, { method: 'DELETE' });
                }
                break;

            case 'videos':
                const videos = await fetch('/api/videos').then(r => r.json());
                for (const video of videos) {
                    await fetch(`/api/videos/${video.videoId}`, { method: 'DELETE' });
                }
                break;

            case 'sites':
                const sites = await fetch('/api/sites').then(r => r.json());
                for (const site of sites) {
                    await fetch(`/api/sites/${site.domain}`, { method: 'DELETE' });
                }
                break;

            case 'apps':
                const apps = await fetch('/api/apps').then(r => r.json());
                for (const app of apps) {
                    await fetch(`/api/apps/${app.processName}`, { method: 'DELETE' });
                }
                break;
        }

    } catch (error) {
        throw new Error(`Ошибка очистки таблицы ${tableName}: ${error.message}`);
    }
}

// Очистка всех таблиц
async function clearAllTables() {
    const tables = ['view_sessions', 'page_sessions', 'app_sessions', 'videos', 'sites', 'apps'];
    const errors = [];

    for (const table of tables) {
        try {
            await clearTable(table);
        } catch (error) {
            errors.push(`${table}: ${error.message}`);
            // Продолжаем очистку остальных таблиц
        }
    }

    if (errors.length > 0) {
        throw new Error(`Ошибки при очистке: ${errors.join('; ')}`);
    }
}

// Функция changeDeleteTable для HTML (оставляем для совместимости)
function changeDeleteTable() {
    updateDeleteUI();
}

window.loadAppTable = loadAppTable;
window.loadAppTimeStats = loadAppTimeStats;
window.loadSiteTable = loadSiteTable;
window.loadSiteTimeStats = loadSiteTimeStats;
window.loadYouTubeTable = loadYouTubeTable;
window.loadAppTableCompact = loadAppTableCompact;
window.loadAppTimeStatsCompact = loadAppTimeStatsCompact;
window.loadSiteTableCompact = loadSiteTableCompact;
window.loadSiteTimeStatsCompact = loadSiteTimeStatsCompact;
window.loadYouTubeTableCompact = loadYouTubeTableCompact;








