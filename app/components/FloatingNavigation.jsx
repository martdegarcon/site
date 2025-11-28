'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'

const navigationItems = [
    {
        id: 1,
        name: 'Рыбалка',
        target: 'fishing',
        color: '#4a90e2',
        image: '/images/fishing.jpg'
    },
    {
        id: 2,
        name: 'Экскурсионные программы',
        target: 'tours',
        color: '#50c878',
        image: '/images/tours.jpeg'
    },
    {
        id: 3,
        name: 'Продукция',
        target: 'products',
        color: '#ff6b6b',
        image: '/images/products.webp'
    },
    {
        id: 4,
        name: 'Мерч',
        target: 'merch',
        color: '#feca57',
        image: '/images/merch.webp'
    },
    {
        id: 5,
        name: 'Снаряжение и приманки',
        target: 'equipment',
        color: '#9b59b6',
        image: '/images/equipment.jpeg'
    }
]

export default function BetterFloatingNavigation() {
    const cardsRef = useRef([])
    const rotationAngleRef = useRef(0)
    const animationFrameRef = useRef(null)
    const tiltRefs = useRef([]) // Храним текущие значения tilt для каждой карточки
    const [isHovered, setIsHovered] = useState(null) // Отслеживаем hover состояние

    useEffect(() => {
        // Радиус от центра логотипа до центра карточки
        const radius = 350 // Расстояние от центра логотипа до центра карточки
        const rotationSpeed = 0.25 // градусов за кадр (уменьшено в два раза)

        // Анимация появления карточек
        const animateCardsIn = () => {
            cardsRef.current.forEach((card, index) => {
                if (!card) return
                card.style.opacity = '0'
                card.style.transform = 'translate(-50%, -50%) scale(0) rotateY(180deg)'

                setTimeout(() => {
                    card.style.transition = 'opacity 0.8s ease-out'
                    card.style.opacity = '1'
                    card.style.visibility = 'visible'
                    // Убираем transition для transform после анимации появления
                    setTimeout(() => {
                        card.style.transition = 'none'
                    }, 800)
                }, index * 100)
            })
        }

        // Запускаем анимацию появления после небольшой задержки
        setTimeout(animateCardsIn, 300)

        const getLogoCenter = () => {
            // Используем точный центр экрана для центрирования
            // Логотип 200x200, смещен вверх на 100px
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2 - 100
            return { x: centerX, y: centerY }
        }

        const updatePositions = () => {
            const logoCenter = getLogoCenter()

            cardsRef.current.forEach((card, index) => {
                if (!card) return

                // Вычисляем угол для каждой карточки
                // Начинаем с -90 градусов (верх), чтобы первая карточка была сверху
                const baseAngle = (index / navigationItems.length) * Math.PI * 2 - Math.PI / 2
                const currentAngle = baseAngle + (rotationAngleRef.current * Math.PI / 180)

                // Вычисляем позицию на круге относительно центра логотипа (3D цилиндр)
                const x = Math.cos(currentAngle) * radius
                const y = Math.sin(currentAngle) * radius

                // Добавляем глубину для 3D эффекта (цилиндрическое расположение)
                // Карточки, которые дальше от камеры (сзади), должны иметь отрицательный z
                // Карточки, которые ближе к камере (спереди), должны иметь положительный z
                const z = Math.sin(currentAngle) * 150 // Глубина для эллиптического эффекта

                // Вычисляем масштаб в зависимости от глубины (для перспективы)
                // Карточки сзади (отрицательный z) должны быть меньше
                // Карточки спереди (положительный z) должны быть больше
                // Базовый масштаб 1.0, диапазон от 0.7 (сзади) до 1.3 (спереди)
                const scale = 1 + (z / 500) // Масштаб в зависимости от глубины

                // Получаем текущие значения tilt для этой карточки
                // Применяем tilt только к карточке в hover состоянии
                const tilt = (isHovered === index)
                    ? (tiltRefs.current[index] || { rotateX: 0, rotateY: 0 })
                    : { rotateX: 0, rotateY: 0 }

                // Устанавливаем позицию карточки в 3D пространстве
                // Карточки остаются обращенными к зрителю, но имеют глубину и масштаб
                card.style.left = `${logoCenter.x + x}px`
                card.style.top = `${logoCenter.y + y}px`
                card.style.transform = `
                    translate(-50%, -50%) 
                    translateZ(${z}px)
                    scale(${scale})
                    rotateX(${tilt.rotateX}deg) 
                    rotateY(${tilt.rotateY}deg)
                `
                // Убеждаемся, что карточка видима
                card.style.opacity = '1'
                card.style.visibility = 'visible'
            })

            // Увеличиваем угол вращения только если нет hover состояния
            // Но продолжаем обновлять позиции для плавности
            if (isHovered === null) {
                rotationAngleRef.current += rotationSpeed
            }
            // Если есть hover, сохраняем текущий угол вращения (не увеличиваем)

            // Запрашиваем следующий кадр
            animationFrameRef.current = requestAnimationFrame(updatePositions)
        }

        // Запускаем анимацию
        animationFrameRef.current = requestAnimationFrame(updatePositions)

        // Обработка изменения размера окна
        const handleResize = () => {
            // Позиции обновятся автоматически в следующем кадре
        }
        window.addEventListener('resize', handleResize)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            window.removeEventListener('resize', handleResize)
        }
    }, [isHovered])

    const handleCardMouseMove = (e, index) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()

        // Вычисляем позицию мыши относительно центра карточки
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY

        // Вычисляем углы наклона (максимум 15 градусов)
        const rotateX = (mouseY / (rect.height / 2)) * -15
        const rotateY = (mouseX / (rect.width / 2)) * 15

        // Сохраняем значения tilt
        tiltRefs.current[index] = { rotateX, rotateY }
    }

    const handleCardMouseEnter = (index) => {
        setIsHovered(index)

        // Сбрасываем tilt для всех других карточек
        cardsRef.current.forEach((card, idx) => {
            if (idx !== index) {
                tiltRefs.current[idx] = { rotateX: 0, rotateY: 0 }
            }
        })

        // Увеличиваем изображение внутри карточки
        const card = cardsRef.current[index]
        if (card) {
            const imageElement = card.querySelector('.card-image')
            if (imageElement) {
                imageElement.style.transform = 'scale(1.15)'
            }
        }
    }

    const handleCardMouseLeave = (index) => {
        setIsHovered(null)

        // Плавно сбрасываем tilt эффект
        const card = cardsRef.current[index]
        if (!card) return

        // Возвращаем изображение к исходному размеру
        const imageElement = card.querySelector('.card-image')
        if (imageElement) {
            imageElement.style.transform = 'scale(1)'
        }

        const currentTilt = tiltRefs.current[index] || { rotateX: 0, rotateY: 0 }
        let startTime = null
        const duration = 300 // миллисекунды

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

            // Плавное затухание
            const easeOut = 1 - Math.pow(1 - progress, 3)
            tiltRefs.current[index] = {
                rotateX: currentTilt.rotateX * (1 - easeOut),
                rotateY: currentTilt.rotateY * (1 - easeOut)
            }

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                tiltRefs.current[index] = { rotateX: 0, rotateY: 0 }
            }
        }
        requestAnimationFrame(animate)
    }

    return (
        <div className="floating-navigation-container">
            {navigationItems.map((item, index) => (
                <Link
                    key={item.id}
                    href={`#${item.target}`}
                    className="nav-card"
                    ref={el => cardsRef.current[index] = el}
                    onMouseEnter={() => handleCardMouseEnter(index)}
                    onMouseMove={(e) => handleCardMouseMove(e, index)}
                    onMouseLeave={() => handleCardMouseLeave(index)}
                    style={{
                        position: 'absolute',
                        width: '200px',
                        height: '280px',
                        margin: 0,
                        padding: 0,
                        boxSizing: 'border-box'
                    }}
                >
                    <div className="card-glow" style={{ background: `radial-gradient(circle, ${item.color}40, transparent)` }}></div>
                    <div className="card-content">
                        <div className="card-border-glow" style={{ background: `linear-gradient(135deg, ${item.color}60, transparent)` }}></div>
                        <div className="card-image-wrapper">
                            <img
                                src={item.image}
                                alt={item.name}
                                width={200}
                                height={200}
                                className="card-image"
                                loading="lazy"
                            />
                            <div className="card-overlay" style={{ background: `linear-gradient(to bottom, transparent, ${item.color}80)` }}></div>
                        </div>
                        <div className="card-title">{item.name}</div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
