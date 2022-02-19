const slider = function () {
    const button_left = document.querySelector('.button_left')
    const button_right = document.querySelector('.button_right')
    const image = document.querySelectorAll('.image')
    const img = document.querySelectorAll('img')
    const body = document.querySelector('body')

    //функция добавления префиксов
    function getSupportedPropertyName(properties) {
        for (let i = 0; i < properties.length; i++) {
            if (typeof document.body.style[properties[i]] != "undefined") {
                return properties[i];
            }
        }
        return null;
    }

    let transform = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];

    let transformProperty = getSupportedPropertyName(transform);

    // задаю анимацию
    function animate({ duration, draw, timing }) {
        const start = performance.now()
        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration
            if (timeFraction > 1) timeFraction = 1
            if (timeFraction < 0) timeFraction = 0
            const progress = timing(timeFraction)
            draw(progress)
            if (timeFraction < 1) {
                requestAnimationFrame(animate)
            }
        })
    }
    //порядковый номер картинок
    let i = 0

    //первая картинка находится на экране
    image[i].style.display = 'block'
    image[i].style[transformProperty] = 'translateX(-100%)'


    sessionStorage.setItem('scroll', true)
    window.requestAnimationFrame(autoscroll)
    window.start = null

    function autoscroll(timestamp) {
        if (!window.start) window.start = timestamp
        progress = timestamp - window.start
        if (!sessionStorage.getItem('scroll')) {
            window.cancelAnimationFrame(autoscroll)
            window.start = 0
            return
        }
        window.requestAnimationFrame(autoscroll)
        if (progress > 3000) {
            window.start = 0
            animate({
                duration: 700,
                timing: function (timeFraction) {
                    return timeFraction
                },
                draw: function (progress) {

                    if (i === image.length - 1) {
                        image[image.length - 1].style[transformProperty] = 'translateX(calc(-100% - ' + progress * 100 + '%))'
                        image[0].style[transformProperty] = 'translateX(-' + progress * 100 + '%)'

                        if (progress === 1) {
                            i = 0
                        }
                        for (let j = 2; j < image.length; j++) {
                            image[j - 1].style[transformProperty] = 'translateX(0)'
                        }
                        return
                    }

                    image[i].style[transformProperty] = 'translateX(calc(-100% - ' + progress * 100 + '%))'
                    image[i + 1].style.display = 'block'
                    image[i + 1].style[transformProperty] = 'translateX(-' + progress * 100 + '%)'
                    if (button_left && button_right) {

                        if (1 > progress > 0) {
                            button_right.removeEventListener('click', btn_r, false)
                            button_left.removeEventListener('click', btn_l, false)
                            return
                        }

                        button_right.addEventListener('click', btn_r, false)
                        button_left.addEventListener('click', btn_l, false)
                    }

                    if (progress === 1) {
                        i++
                    }
                }
            })
        }
    }

    for (let j = 0; j < img.length; j++) {
        img[j].addEventListener('click', function () {
            if (sessionStorage.getItem('scroll')) {
                sessionStorage.clear()
                animate({
                    duration: 300,
                    timing: function (timeFraction) {
                        return timeFraction
                    },
                    draw: function (progress) {
                        img[j].style.height = 300 + progress * 200 + 'px'
                        img[j].style.outline = '10px solid #fff'
                        if (button_left && button_right) {
                            button_left.style.left = 'calc(5% - ' + progress * 300 + 'px)'
                            button_right.style.right = 'calc(5% - ' + progress * 300 + 'px)'
                        }
                        body.style.backgroundColor = '#777'
                        return
                    }
                })

                return
            }

            sessionStorage.setItem('scroll', true)
            window.requestAnimationFrame(autoscroll)
            animate({
                duration: 300,
                timing: function (timeFraction) {
                    return timeFraction
                },
                draw: function (progress) {
                    img[i].style.height = 300 + (1 - progress) * 200 + 'px'
                    img[i].style.outline = 'none'
                    body.style.backgroundColor = '#ccc'
                    button_left.style.left = 'calc(5% - ' + (1 - progress) * 300 + 'px)'
                    button_right.style.right = 'calc(5% - ' + (1 - progress) * 300 + 'px)'
                }
            })
        })
    }

    const btn_r = function () {
        window.start = 0
        animate({
            duration: 700,
            timing: function (timeFraction) {
                return timeFraction
            },
            draw: function (progress) {

                //если включена последняя картинка
                if (i === image.length - 1) {

                    //первая и последняя прокручиваются плавно
                    image[image.length - 1].style[transformProperty] = 'translateX(calc(-100% - ' + progress * 100 + '%))'
                    image[0].style[transformProperty] = 'translateX(-' + progress * 100 + '%)'

                    //после окончания анимации порядковый номер картинки сбрасывается
                    if (progress === 1) {
                        i = 0
                    }

                    //Остальные, кроме первой и последней, быстро перемещаются в исходное положение
                    for (let j = 2; j < image.length; j++) {
                        image[j - 1].style[transformProperty] = 'translateX(0)'
                    }
                } else {
                    //плавная прокрутка нынешней и следующей картинок
                    image[i].style[transformProperty] = 'translateX(calc(-100% - ' + progress * 100 + '%))'
                    image[i + 1].style.display = 'block'
                    image[i + 1].style[transformProperty] = 'translateX(-' + progress * 100 + '%)'
                    if (progress === 1) {
                        i++
                    }
                }

                //выключение работоспособности кнопок во время анимации
                if (1 > progress > 0) {
                    button_right.removeEventListener('click', btn_r, false)
                    return
                }

                button_right.addEventListener('click', btn_r, false)
            }
        })
    }
    if (button_right) {
        button_right.addEventListener('click', btn_r, false)
    }

    const btn_l = function () {
        window.start = 0

        animate({
            duration: 700,
            timing: function (timeFraction) {
                return timeFraction
            },
            draw: function (progress) {

                if (i === 0) {
                    image[image.length - 1].style[transformProperty] = 'translateX(calc(-100% - ' + (1 - progress) * 100 + '%))'
                    image[image.length - 1].style.display = 'block'
                    image[0].style[transformProperty] = 'translateX(-' + (1 - progress) * 100 + '%)'

                    if (progress === 1) {
                        i = image.length - 1
                    }

                    for (let j = 2; j < image.length; j++) {
                        image[j - 1].style[transformProperty] = 'translateX(0)'
                    }
                } else {
                    image[i - 1].style[transformProperty] = 'translateX(calc(-100% - ' + (1 - progress) * 100 + '%))'
                    image[i - 1].style.display = 'block'
                    image[i].style[transformProperty] = 'translateX(-' + (1 - progress) * 100 + '%)'
                    if (progress === 1) {
                        i--
                    }
                }

                if (1 > progress > 0) {
                    button_left.removeEventListener('click', btn_l, false)
                    return
                }

                button_left.addEventListener('click', btn_l, false)
            }
        })
    }

    if (button_left) {
        button_left.addEventListener('click', btn_l, false)
    }
}

slider()