document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Сайт загружен. Ожидание Tawk.to...');
    
    // Переменные для управления
    let isChatVisible = true;
    let tawkLoaded = false;
    
    // 1. Кнопка "Открыть чат" в герое
    const chatToggleBtn = document.getElementById('chat-toggle');
    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', function() {
            if (typeof Tawk_API !== 'undefined') {
                Tawk_API.maximize();
            } else {
                alert('Чат ещё загружается. Подождите 2-3 секунды.');
            }
        });
    }
    
    // 2. Проверка загрузки Tawk.to
    function checkTawkLoaded() {
        if (typeof Tawk_API !== 'undefined' && Tawk_API.onLoad) {
            tawkLoaded = true;
            console.log('✅ Tawk.to загружен');
            setupChatControls();
            return true;
        }
        return false;
    }
    
    // 3. Настройка кнопок управления чатом
    function setupChatControls() {
        console.log('Настройка кнопок управления чатом...');
        
        // Обновляем статус
        const statusEl = document.getElementById('tawk-status');
        if (statusEl) {
            statusEl.innerHTML = `
                <i class="fas fa-check-circle" style="color: #27ae60; font-size: 3rem; margin-bottom: 15px;"></i>
                <h3>Чат успешно подключён</h3>
                <p>Код виджета Tawk.to загружен. Нажмите на кнопку в правом нижнем углу, чтобы начать диалог.</p>
                <div class="test-buttons">
                    <button id="test-open" class="test-btn">
                        <i class="fas fa-external-link-alt"></i> Открыть чат
                    </button>
                    <button id="test-hide" class="test-btn">
                        <i class="fas fa-eye-slash"></i> Скрыть виджет
                    </button>
                    <button id="test-show" class="test-btn" style="display:none; background:#9b59b6;">
                        <i class="fas fa-eye"></i> Показать виджет
                    </button>
                </div>
                <p style="margin-top: 15px; color: #27ae60; font-weight: bold;">
                    <i class="fas fa-check"></i> Статус: подключено | Виджет: <span id="widget-status">видим</span>
                </p>
            `;
            
            // Назначаем обработчики НОВЫМ кнопкам
            setTimeout(() => {
                setupButtonHandlers();
            }, 100);
        }
    }
    
    // 4. Обработчики для кнопок
    function setupButtonHandlers() {
        // Кнопка "Открыть чат" (в блоке статуса)
        const testOpenBtn = document.getElementById('test-open');
        if (testOpenBtn) {
            testOpenBtn.addEventListener('click', function() {
                if (typeof Tawk_API !== 'undefined') {
                    Tawk_API.maximize();
                }
            });
        }
        
        // Кнопка "Скрыть виджет"
        const testHideBtn = document.getElementById('test-hide');
        const testShowBtn = document.getElementById('test-show');
        const widgetStatus = document.getElementById('widget-status');
        
        if (testHideBtn) {
            testHideBtn.addEventListener('click', function() {
                hideTawkWidget();
                if (testShowBtn) testShowBtn.style.display = 'inline-flex';
                testHideBtn.style.display = 'none';
                if (widgetStatus) widgetStatus.textContent = 'скрыт';
                isChatVisible = false;
            });
        }
        
        // Кнопка "Показать виджет"
        if (testShowBtn) {
            testShowBtn.addEventListener('click', function() {
                showTawkWidget();
                testShowBtn.style.display = 'none';
                if (testHideBtn) testHideBtn.style.display = 'inline-flex';
                if (widgetStatus) widgetStatus.textContent = 'видим';
                isChatVisible = true;
            });
        }
    }
    
    // 5. Функция скрытия виджета Tawk.to
    function hideTawkWidget() {
        // Способ 1: Через CSS (самый надёжный)
        const style = document.createElement('style');
        style.id = 'tawk-hide-style';
        style.textContent = `
            .tawk-button-container,
            [class*="tawk-"][class*="button"],
            #tawkchat-container,
            iframe[title*="tawk"],
            .tawk-min-container {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
        `;
        document.head.appendChild(style);
        
        // Способ 2: Если Tawk_API доступен
        if (typeof Tawk_API !== 'undefined' && Tawk_API.hideWidget) {
            try {
                Tawk_API.hideWidget();
            } catch(e) {
                console.log('Tawk_API.hideWidget не сработал, используем CSS');
            }
        }
        
        console.log('Виджет чата скрыт');
    }
    
    // 6. Функция показа виджета Tawk.to
    function showTawkWidget() {
        // Удаляем скрывающие стили
        const hideStyle = document.getElementById('tawk-hide-style');
        if (hideStyle) {
            hideStyle.remove();
        }
        
        // Показываем через Tawk_API
        if (typeof Tawk_API !== 'undefined' && Tawk_API.showWidget) {
            try {
                Tawk_API.showWidget();
            } catch(e) {
                console.log('Tawk_API.showWidget не сработал');
            }
        }
        
        console.log('Виджет чата показан');
    }
    
    // 7. Запускаем проверку загрузки Tawk.to
    const checkInterval = setInterval(() => {
        if (checkTawkLoaded()) {
            clearInterval(checkInterval);
        }
    }, 500);
    
    // 8. Таймаут: если Tawk.to не загрузился за 10 секунд
    setTimeout(() => {
        if (!tawkLoaded) {
            console.warn('Tawk.to не загрузился, показываем демо-кнопки');
            setupChatControls();
            setupButtonHandlers();
        }
    }, 10000);
    
    // 9. Глобальные функции для тестирования из консоли
    window.hideChat = hideTawkWidget;
    window.showChat = showTawkWidget;
});