/**
 * ============================================================
 * بسته آموزشی آشنایی با انیمیشن و ایده‌پردازی با هوش مصنوعی
 * JavaScript یکپارچه و کامل - نسخه ۲.۰
 * ============================================================
 */

(function () {
    'use strict';

    // =========================================================
    // ۱. ابزارهای عمومی
    // =========================================================

    const Utils = {
        // تبدیل اعداد انگلیسی به فارسی
        toPersianNumber: function (num) {
            if (num === undefined || num === null) return '';
            return String(num).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
        },

        // پیدا کردن المان با امنیت
        getElement: function (id) {
            return document.getElementById(id);
        },

        // بررسی وجود المان
        exists: function (el) {
            return el !== null && el !== undefined;
        },

        // محدود کردن عدد بین دو مقدار
        clamp: function (value, min, max) {
            return Math.min(Math.max(value, min), max);
        }
    };


    // =========================================================
    // ۲. مدیریت اسلایدهای پاورپوینت
    // =========================================================

    const SlideManager = {
        totalSlides: 20,
        currentSlide: 0,
        slides: [],
        imageElement: null,
        countElement: null,
        dotsContainer: null,

        init: function () {
            this.slides = Array.from({ length: this.totalSlides }, (_, i) => i + 1);
            this.imageElement = Utils.getElement('slideImage');
            this.countElement = Utils.getElement('slideCount');
            this.dotsContainer = Utils.getElement('dots');

            if (!this.imageElement || !this.countElement) return;

            this.buildDots();
            this.showSlide(0);
            this.bindEvents();
        },

        buildDots: function () {
            if (!this.dotsContainer) return;

            const dotCount = Math.ceil(this.totalSlides / 4);
            this.dotsContainer.innerHTML = '';

            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `نمایش گروه ${Utils.toPersianNumber(i + 1)} اسلایدها`);
                dot.dataset.group = i;
                dot.addEventListener('click', () => this.showSlide(i * 4));
                this.dotsContainer.appendChild(dot);
            }
        },

        showSlide: function (index) {
            if (!this.imageElement || !this.countElement) return;

            this.currentSlide = (index + this.slides.length) % this.slides.length;
            const slideNumber = this.slides[this.currentSlide];

            this.imageElement.src = `assets/slide${slideNumber}.png`;
            this.imageElement.alt = `پیش‌نمایش اسلاید ${Utils.toPersianNumber(this.currentSlide + 1)}`;
            this.countElement.textContent = `${Utils.toPersianNumber(this.currentSlide + 1)} / ${Utils.toPersianNumber(this.totalSlides)}`;

            this.updateDots();
        },

        updateDots: function () {
            if (!this.dotsContainer) return;

            const activeGroup = Math.floor(this.currentSlide / 4);
            Array.from(this.dotsContainer.children).forEach((dot, index) => {
                const isActive = index === activeGroup;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        },

        next: function () {
            this.showSlide(this.currentSlide + 1);
        },

        prev: function () {
            this.showSlide(this.currentSlide - 1);
        },

        bindEvents: function () {
            // دکمه‌های قبلی/بعدی
            document.querySelector('[data-slide-next]')?.addEventListener('click', () => this.next());
            document.querySelector('[data-slide-prev]')?.addEventListener('click', () => this.prev());
            Utils.getElement('nextSlide')?.addEventListener('click', () => this.next());
            Utils.getElement('prevSlide')?.addEventListener('click', () => this.prev());

            // کیبورد
            document.addEventListener('keydown', (event) => {
                const activeElement = document.activeElement;
                const isTyping = activeElement &&
                    (activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA' ||
                        activeElement.isContentEditable);

                if (isTyping) return;
                if (ModalManager.isOpen()) return;

                if (event.key === 'ArrowRight') this.next();
                if (event.key === 'ArrowLeft') this.prev();
            });
        }
    };


    // =========================================================
    // ۳. مدیریت صفحات جزوه
    // =========================================================

    const WorkbookManager = {
        totalPages: 14,
        currentPage: 1,
        imageElement: null,
        infoElement: null,

        init: function () {
            this.imageElement = Utils.getElement('workbookImage');
            this.infoElement = Utils.getElement('workbookPageInfo');

            if (!this.imageElement || !this.infoElement) return;

            this.showPage(1);
            this.bindEvents();
        },

        showPage: function (pageNumber) {
            if (pageNumber < 1 || pageNumber > this.totalPages) return;

            this.currentPage = pageNumber;
            this.imageElement.src = `assets/workbook-page-${pageNumber}.png`;
            this.imageElement.alt = `صفحه ${Utils.toPersianNumber(pageNumber)} جزوه آموزشی`;
            this.infoElement.textContent = `${Utils.toPersianNumber(pageNumber)} / ${Utils.toPersianNumber(this.totalPages)}`;
        },

        next: function () {
            if (this.currentPage < this.totalPages) {
                this.showPage(this.currentPage + 1);
            }
        },

        prev: function () {
            if (this.currentPage > 1) {
                this.showPage(this.currentPage - 1);
            }
        },

        bindEvents: function () {
            document.querySelector('[data-workbook-next]')?.addEventListener('click', () => this.next());
            document.querySelector('[data-workbook-prev]')?.addEventListener('click', () => this.prev());
            Utils.getElement('nextWorkbookPage')?.addEventListener('click', () => this.next());
            Utils.getElement('prevWorkbookPage')?.addEventListener('click', () => this.prev());

            document.addEventListener('keydown', (event) => {
                const activeElement = document.activeElement;
                const isTyping = activeElement &&
                    (activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA' ||
                        activeElement.isContentEditable);

                if (isTyping) return;
                if (ModalManager.isOpen()) return;

                if (event.key === 'PageDown') this.next();
                if (event.key === 'PageUp') this.prev();
            });
        }
    };


    // =========================================================
    // ۴. مدیریت مودال
    // =========================================================

    const ModalManager = {
        modalElement: null,
        imageElement: null,
        isOpen: false,

        init: function () {
            this.modalElement = Utils.getElement('modal');
            this.imageElement = Utils.getElement('modalImg');

            if (!this.modalElement || !this.imageElement) return;

            this.bindEvents();
        },

        open: function (source) {
            if (!source || !this.modalElement || !this.imageElement) return;

            this.imageElement.src = source;
            this.modalElement.classList.add('open');
            this.modalElement.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;

            this.modalElement.querySelector('.close')?.focus();
        },

        close: function (event) {
            if (!this.modalElement) return;

            if (event) {
                const clickedBackground = event.target === this.modalElement;
                const clickedClose = event.target.closest('.close');
                if (!clickedBackground && !clickedClose) return;
            }

            this.modalElement.classList.remove('open');
            this.modalElement.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            this.isOpen = false;
        },

        isOpen: function () {
            return this.isOpen;
        },

        bindEvents: function () {
            // کلیک روی مودال برای بستن
            this.modalElement.addEventListener('click', (event) => this.close(event));

            // دکمه Escape
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // تصاویر قابل بزرگنمایی
            document.querySelectorAll('.zoomable, .gallery-card, .preview img').forEach(element => {
                element.addEventListener('click', () => {
                    const img = element.querySelector('img') || element;
                    if (img.tagName === 'IMG' && img.src) {
                        this.open(img.src);
                    }
                });
            });

            // تابع‌های global برای onclick
            window.openModal = (src) => this.open(src);
            window.closeModal = (e) => this.close(e);
        }
    };


    // =========================================================
    // ۵. مدیریت منوی موبایل
    // =========================================================

    const MobileMenuManager = {
        button: null,
        navLinks: null,
        isOpen: false,

        init: function () {
            this.button = document.querySelector('.menu');
            this.navLinks = document.querySelector('.nav-links');

            if (!this.button || !this.navLinks) return;

            this.button.setAttribute('aria-expanded', 'false');
            this.bindEvents();
        },

        open: function () {
            this.navLinks.classList.add('mobile-open');
            this.button.classList.add('active');
            this.button.setAttribute('aria-expanded', 'true');
            this.button.textContent = '✕';
            this.isOpen = true;
        },

        close: function () {
            this.navLinks.classList.remove('mobile-open');
            this.button.classList.remove('active');
            this.button.setAttribute('aria-expanded', 'false');
            this.button.textContent = '☰';
            this.isOpen = false;
        },

        toggle: function () {
            this.isOpen ? this.close() : this.open();
        },

        bindEvents: function () {
            this.button.addEventListener('click', () => this.toggle());

            // بستن با کلیک روی لینک
            this.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // بستن با Escape
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this.isOpen) {
                    this.close();
                    this.button.focus();
                }
            });

            // بستن با کلیک خارج
            document.addEventListener('click', (event) => {
                if (this.isOpen) {
                    const isInside = this.navLinks.contains(event.target) || this.button.contains(event.target);
                    if (!isInside) this.close();
                }
            });

            // بستن هنگام تغییر اندازه
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (window.innerWidth > 650 && this.isOpen) {
                        this.close();
                    }
                }, 200);
            });
        }
    };


    // =========================================================
    // ۶. مدیریت هفت قدم طلایی
    // =========================================================

    const RoadmapManager = {
        steps: [],
        detailIcon: null,
        detailStep: null,
        detailTitle: null,
        detailText: null,
        detailTip: null,
        progressElement: null,
        lineProgress: null,
        currentStep: 1,
        totalSteps: 7,

        // داده‌های هر قدم
        data: {
            1: {
                icon: '💡',
                title: 'ایده‌پردازی',
                text: 'همه‌چیز با یک سؤال، یک فکر یا یک «اگر... چه می‌شد؟» شروع می‌شود. ایده‌ای پیدا کن که بتوانی آن را به یک داستان تصویری تبدیل کنی.',
                tip: 'سؤال‌های عجیب می‌توانند ایده‌های جذابی بسازند!'
            },
            2: {
                icon: '🧑‍🎨',
                title: 'طراحی شخصیت',
                text: 'قهرمان داستانت را بساز. به ظاهر، شخصیت و انگیزه‌های او فکر کن. چه کسی در داستان تو نقش اصلی را بازی می‌کند؟',
                tip: 'شخصیت‌های به‌یادماندنی معمولاً نقاط قوت و ضعف دارند.'
            },
            3: {
                icon: '🏞️',
                title: 'طراحی صحنه',
                text: 'دنیای داستان را بساز. مکان‌ها، فضاها و محیطی که شخصیت‌ها در آن زندگی می‌کنند را طراحی کن.',
                tip: 'جزئیات کوچک در صحنه‌ها به باورپذیری داستان کمک می‌کنند.'
            },
            4: {
                icon: '🎞️',
                title: 'ساخت فریم‌ها',
                text: 'داستان را حرکت بده. هر حرکت، تغییر و اتفاق را به صورت فریم‌های جداگانه طراحی کن تا انیمیشن شکل بگیرد.',
                tip: 'هرچه فریم‌های بیشتری داشته باشی، حرکت روان‌تر خواهد بود.'
            },
            5: {
                icon: '🎙️',
                title: 'ضبط صدا',
                text: 'به داستانت صدا بده. دیالوگ‌ها، صداهای محیط و موسیقی را ضبط کن تا انیمیشن جان بگیرد.',
                tip: 'صداهای محیطی می‌توانند تأثیر احساسی انیمیشن را دوچندان کنند.'
            },
            6: {
                icon: '✂️',
                title: 'مونتاژ و ویرایش',
                text: 'قطعات را کنار هم بچین. فریم‌ها، صداها و المان‌ها را در کنار هم قرار بده تا انیمیشن نهایی شکل بگیرد.',
                tip: 'ریتم و زمان‌بندی در مونتاژ بسیار مهم است.'
            },
            7: {
                icon: '🎬',
                title: 'نمایش نهایی',
                text: 'اثر خودت را به دنیا نشان بده. انیمیشن ساخته‌شده را مرور کن، از آن لذت ببر و با دیگران به اشتراک بگذار.',
                tip: 'هر انیمیشنی با نمایش کامل‌تر می‌شود! بازخوردها را جدی بگیر.'
            }
        },

        init: function () {
            this.steps = document.querySelectorAll('.roadmap-step');
            this.detailIcon = document.getElementById('detailIcon');
            this.detailStep = document.getElementById('detailStep');
            this.detailTitle = document.getElementById('detailTitle');
            this.detailText = document.getElementById('detailText');
            this.detailTip = document.getElementById('detailTip');
            this.progressElement = document.getElementById('roadmapProgress');
            this.lineProgress = document.getElementById('roadmapLineProgress');

            if (this.steps.length === 0) return;

            this.bindEvents();
            this.showStep(1);
        },

        showStep: function (stepNumber) {
            this.currentStep = Utils.clamp(stepNumber, 1, this.totalSteps);
            const data = this.data[this.currentStep];

            if (!data) return;

            // به‌روزرسانی کلاس‌های فعال
            this.steps.forEach((step, index) => {
                const stepNum = index + 1;
                step.classList.toggle('active', stepNum === this.currentStep);
                step.classList.toggle('completed', stepNum < this.currentStep);
            });

            // به‌روزرسانی جزئیات
            if (this.detailIcon) this.detailIcon.textContent = data.icon;
            if (this.detailStep) this.detailStep.textContent = `قدم ${Utils.toPersianNumber(this.currentStep)}`;
            if (this.detailTitle) this.detailTitle.textContent = data.title;
            if (this.detailText) this.detailText.textContent = data.text;
            if (this.detailTip) this.detailTip.textContent = data.tip;

            // به‌روزرسانی پیشرفت
            if (this.progressElement) {
                this.progressElement.textContent = `${Utils.toPersianNumber(this.currentStep)} از ${Utils.toPersianNumber(this.totalSteps)}`;
            }

            if (this.lineProgress) {
                const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
                this.lineProgress.style.width = `${progress}%`;
            }

            // انیمیشن ورود
            const detail = document.querySelector('.roadmap-detail');
            if (detail) {
                detail.style.animation = 'none';
                requestAnimationFrame(() => {
                    detail.style.animation = 'roadmapDetailIn .35s ease';
                });
            }
        },

        next: function () {
            if (this.currentStep < this.totalSteps) {
                this.showStep(this.currentStep + 1);
            }
        },

        prev: function () {
            if (this.currentStep > 1) {
                this.showStep(this.currentStep - 1);
            }
        },

        bindEvents: function () {
            this.steps.forEach((step) => {
                step.addEventListener('click', () => {
                    const stepNum = parseInt(step.dataset.step);
                    if (!isNaN(stepNum)) {
                        this.showStep(stepNum);
                    }
                });
            });

            // پشتیبانی از کیبورد
            document.addEventListener('keydown', (event) => {
                const activeElement = document.activeElement;
                const isTyping = activeElement &&
                    (activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA' ||
                        activeElement.isContentEditable);

                if (isTyping) return;

                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    this.next();
                }
                if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    this.prev();
                }
            });
        }
    };


    // =========================================================
    // ۷. مدیریت اسکرول و انیمیشن ورود
    // =========================================================

    const ScrollManager = {
        observer: null,

        init: function () {
            const elements = document.querySelectorAll('.card, .gallery-card, .about-box, .viewer, .pdf-viewer');

            if (!('IntersectionObserver' in window) || elements.length === 0) return;

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -30px 0px'
            });

            elements.forEach(element => {
                element.classList.add('reveal-ready');
                this.observer.observe(element);
            });
        }
    };


    // =========================================================
    // ۸. مدیریت کلیک روی لینک‌های داخلی (اسکرول نرم)
    // =========================================================

    const SmoothScrollManager = {
        init: function () {
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (event) => {
                    const targetId = link.getAttribute('href');
                    if (!targetId || targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (!target) return;

                    event.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            });
        }
    };


    // =========================================================
    // ۹. مدیریت خطاهای تصاویر
    // =========================================================

    const ImageErrorManager = {
        init: function () {
            document.querySelectorAll('img').forEach(image => {
                image.addEventListener('error', () => {
                    image.classList.add('image-error');
                    // می‌توان یک تصویر پیش‌فرض جایگزین کرد
                    // image.src = 'assets/placeholder.png';
                });
            });
        }
    };


    // =========================================================
    // ۱۰. پیشگیری از راست‌کلیک و کشیدن
    // =========================================================

    const SecurityManager = {
        init: function () {
            // جلوگیری از راست‌کلیک روی تصاویر
            document.addEventListener('contextmenu', (event) => {
                const target = event.target;
                if (target.tagName === 'IMG' || target.closest('.preview') || target.closest('.gallery-card')) {
                    event.preventDefault();
                }
            });

            // جلوگیری از کشیدن تصاویر
            document.addEventListener('dragstart', (event) => {
                if (event.target.tagName === 'IMG') {
                    event.preventDefault();
                }
            });
        }
    };


    // =========================================================
    // ۱۱. مقداردهی اولیه (Initialization)
    // =========================================================

    document.addEventListener('DOMContentLoaded', function () {
        // ترتیب بارگذاری اهمیت دارد
        ModalManager.init();
        SlideManager.init();
        WorkbookManager.init();
        RoadmapManager.init();
        MobileMenuManager.init();
        SmoothScrollManager.init();
        ScrollManager.init();
        ImageErrorManager.init();
        SecurityManager.init();

        // افزودن کلاس‌های CSS برای انیمیشن
        const style = document.createElement('style');
        style.textContent = `
            .reveal-ready {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .is-visible {
                opacity: 1;
                transform: translateY(0);
            }
            .image-error {
                opacity: 0.5;
                filter: grayscale(1);
            }
            .modal-open {
                overflow: hidden !important;
            }
        `;
        document.head.appendChild(style);

        console.log('✅ بسته آموزشی انیمیشن با موفقیت بارگذاری شد.');
    });

})();