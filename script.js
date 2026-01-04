document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modalOverlay');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const contactForm = document.getElementById('contactForm');
    const tabs = document.querySelectorAll('.tab');
    const phoneInput = document.querySelector('.phone-input');

    const successModalOverlay = document.getElementById('successModalOverlay');
    const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
    const successModalBtn = document.getElementById('successModalBtn');

    modalOverlay.classList.remove('active');
    successModalOverlay.classList.remove('active');

    openModalBtn.addEventListener('click', function() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeModalBtn.addEventListener('click', function() {
        closeFormModal();
    });

    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            closeFormModal();
        }
    });

    closeSuccessModalBtn.addEventListener('click', function() {
        closeSuccessModal();
    });

    successModalOverlay.addEventListener('click', function(event) {
        if (event.target === successModalOverlay) {
            closeSuccessModal();
        }
    });

    successModalBtn.addEventListener('click', function() {
        closeSuccessModal();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) {
                closeFormModal();
            }
            if (successModalOverlay.classList.contains('active')) {
                closeSuccessModal();
            }
        }
    });

    function closeFormModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function closeSuccessModal() {
        successModalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function openSuccessModal() {
        successModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const tabType = this.getAttribute('data-tab');
            if (tabType === 'telegram') {
                phoneInput.placeholder = 'Ник в Telegram';
                phoneInput.type = 'text';
            } else {
                phoneInput.placeholder = 'Телефон';
                phoneInput.type = 'tel';
            }
        });
    });

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const phone = phoneInput.value;
        const name = this.querySelector('input[type="text"]').value;
        const gender = this.querySelector('input[name="gender"]:checked');
        const age = this.querySelector('.age').value;
        const privacy = this.querySelector('input[type="checkbox"]').checked;
        const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
        
        if (!phone) {
            alert('Пожалуйста, введите ' + (activeTab === 'telegram' ? 'ник в Telegram' : 'номер телефона'));
            return;
        }
        
        if (!gender) {
            alert('Пожалуйста, выберите пол');
            return;
        }
        
        if (!privacy) {
            alert('Пожалуйста, согласитесь с условиями');
            return;
        }
        
        console.log({
            contactMethod: activeTab === 'telegram' ? 'Telegram' : 'Phone',
            contact: phone,
            name,
            gender: gender.value,
            age,
            privacy
        });
        
        closeFormModal();
        
        this.reset();
        
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelector('.tab[data-tab="phone"]').classList.add('active');
        phoneInput.placeholder = 'Телефон';
        phoneInput.type = 'tel';
        
        setTimeout(() => {
            openSuccessModal();
        }, 300);
    });

    const radioButtons = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.type === 'radio') {
                const label = this.closest('.gender-option');
                label.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    label.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });

    const sideForm = document.getElementById('sideForm');
    const sideFormInputs = sideForm.querySelectorAll('.form-input');
    const sideFormRadios = sideForm.querySelectorAll('input[type="radio"]');

    sideForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        sideFormInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#FF2C33';
            } else {
                input.style.borderColor = 'rgba(39, 37, 37, 0.5)';
            }
        });
        
        const selectedGender = sideForm.querySelector('input[name="gender-side"]:checked');
        if (!selectedGender) {
            isValid = false;
            document.querySelector('.gender-options').style.borderColor = '#FF2C33';
        } else {
            document.querySelector('.gender-options').style.borderColor = 'rgba(39, 37, 37, 0.5)';
        }
        
        const privacyChecked = sideForm.querySelector('input[type="checkbox"]').checked;
        if (!privacyChecked) {
            isValid = false;
            alert('Пожалуйста, согласитесь с условиями');
            return;
        }
        
        if (!isValid) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        const formData = {
            name: sideFormInputs[0].value,
            phone: sideFormInputs[1].value,
            email: sideFormInputs[2].value,
            age: sideFormInputs[3].value,
            gender: selectedGender.value
        };
        
        console.log('Данные боковой формы:', formData);
        
        sideForm.reset();
        
        openSuccessModal();
    });

    sideFormRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const label = this.closest('.gender-option');
            label.style.transform = 'scale(0.95)';
            setTimeout(() => {
                label.style.transform = 'scale(1)';
            }, 150);
        });
    });

    sideFormInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = 'rgba(39, 37, 37, 0.5)';
            }
        });
    });

    initSlider();
    
    initMap();
    
    initMobileOptimizations();
});

let currentSlideNumber = 1;
let isAnimating = false;
let availableSlides = [];
let slidesPreloaded = {};

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function preloadAllSlides() {
    const preloadPromises = [];
    
    for (let i = 1; i <= 10; i++) {
        const src = `files/Interior/${i}.png`;
        preloadPromises.push(
            loadImage(src).then(img => {
                availableSlides.push(i);
                slidesPreloaded[i] = img;
                return i;
            }).catch(() => {
                return null;
            })
        );
    }
    
    await Promise.all(preloadPromises);
    
    availableSlides = availableSlides.filter(Boolean).sort((a, b) => a - b);
    
    if (availableSlides.length === 0) {
        console.log('Нет доступных изображений в папке files/Interior/');
        return false;
    }
    
    return true;
}

function changeSlide(direction) {
    if (isAnimating || availableSlides.length === 0) return;
    
    isAnimating = true;
    
    const activeSlide = document.querySelector('.active-slide');
    const nextSlide = document.querySelector('.next-slide');
    const currentIndex = availableSlides.indexOf(currentSlideNumber);
    let nextIndex;
    
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % availableSlides.length;
    } else {
        nextIndex = (currentIndex - 1 + availableSlides.length) % availableSlides.length;
    }
    
    const nextSlideNumber = availableSlides[nextIndex];
    const nextImageSrc = `files/Interior/${nextSlideNumber}.png`;
    
    if (slidesPreloaded[nextSlideNumber]) {
        nextSlide.src = nextImageSrc;
    } else {
        loadImage(nextImageSrc).then(() => {
            nextSlide.src = nextImageSrc;
        }).catch(() => {
            console.log(`Ошибка загрузки изображения: ${nextImageSrc}`);
            isAnimating = false;
            return;
        });
    }
    
    nextSlide.alt = `Интерьер ресторана ${nextSlideNumber}`;
    
    requestAnimationFrame(() => {
        activeSlide.style.opacity = '0';
        
        setTimeout(() => {
            requestAnimationFrame(() => {
                nextSlide.style.opacity = '1';
                
                setTimeout(() => {
                    activeSlide.classList.remove('active-slide');
                    nextSlide.classList.remove('next-slide');
                    nextSlide.classList.add('active-slide');
                    activeSlide.classList.add('next-slide');
                    
                    currentSlideNumber = nextSlideNumber;
                    
                    activeSlide.style.opacity = '0';
                    nextSlide.style.opacity = '1';
                    
                    const nextHiddenIndex = (nextIndex + 1) % availableSlides.length;
                    const nextHiddenSlideNumber = availableSlides[nextHiddenIndex];
                    const hiddenImageSrc = `files/Interior/${nextHiddenSlideNumber}.png`;
                    
                    if (!slidesPreloaded[nextHiddenSlideNumber]) {
                        loadImage(hiddenImageSrc).then(img => {
                            slidesPreloaded[nextHiddenSlideNumber] = img;
                        });
                    }
                    
                    isAnimating = false;
                }, 800);
            });
        }, 100);
    });
}

async function initSlider() {
    const hasSlides = await preloadAllSlides();
    
    if (!hasSlides) {
        document.querySelector('.photo-slider').style.display = 'none';
        return;
    }
    
    const activeSlide = document.querySelector('.active-slide');
    activeSlide.src = `files/Interior/${availableSlides[0]}.png`;
    activeSlide.alt = `Интерьер ресторана ${availableSlides[0]}`;
    
    const leftArrow = document.querySelector('.slider-arrow.left');
    const rightArrow = document.querySelector('.slider-arrow.right');
    
    leftArrow.addEventListener('click', () => changeSlide('prev'));
    rightArrow.addEventListener('click', () => changeSlide('next'));
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide('prev');
        } else if (e.key === 'ArrowRight') {
            changeSlide('next');
        }
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;
    
    const slideImage = document.querySelector('.slide-image');
    
    slideImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        e.preventDefault();
    }, { passive: false });
    
    slideImage.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    slideImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeSlide('next');
            } else {
                changeSlide('prev');
            }
        }
        
        e.preventDefault();
    }, { passive: false });
}

function initMap() {
    if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps API не загружена. Проверьте подключение скрипта.');
        document.getElementById('map').innerHTML = 
            '<div style="width:100%;height:500px;display:flex;align-items:center;justify-content:center;background:#f5f5f5;border-radius:20px;">' +
            '<p>Карта временно недоступна. Используйте кнопки для построения маршрута.</p>' +
            '</div>';
        return;
    }
    
    ymaps.ready(function() {
        try {

            var myMap = new ymaps.Map("map", {
                center: [55.6943, 37.6646], 
                zoom: 16,
                controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
            });
            
            var myPlacemark = new ymaps.Placemark([55.6943, 37.6646], {
                balloonContent: 'Ресторан «IL Патио», м. Технопарк, просп. Андропова, 1, этаж 1'
            }, {
                preset: 'islands#redDotIcon'
            });
            
            myMap.geoObjects.add(myPlacemark);
            
            myMap.behaviors.enable(['drag', 'scrollZoom', 'dblClickZoom']);
            
            console.log('Карта успешно инициализирована');
            
        } catch (error) {
            console.error('Ошибка при создании карты:', error);
            document.getElementById('map').innerHTML = 
                '<div style="width:100%;height:500px;display:flex;align-items:center;justify-content:center;background:#f5f5f5;border-radius:20px;color:#ff2c33;">' +
                '<p>Ошибка загрузки карты. Попробуйте обновить страницу.</p>' +
                '</div>';
        }
    });
}

function initMobileOptimizations() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        const slideImage = document.querySelector('.slide-image');
        if (slideImage) {
            slideImage.style.touchAction = 'pan-y pinch-zoom';
        }
        
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });

        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            });
            
            button.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });
        
        const radioOptions = document.querySelectorAll('.gender-option');
        radioOptions.forEach(option => {
            option.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            option.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}