'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navigationItems = [
    {
        id: 1,
        name: 'Направление 1',
        target: 'direction1',
        color: '#ff6b6b',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    },
    {
        id: 2,
        name: 'Направление 2',
        target: 'direction2',
        color: '#4ecdc4',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop'
    },
    {
        id: 3,
        name: 'Направление 3',
        target: 'direction3',
        color: '#45b7d1',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop'
    },
    {
        id: 4,
        name: 'Направление 4',
        target: 'direction4',
        color: '#96ceb4',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop'
    },
    {
        id: 5,
        name: 'Направление 5',
        target: 'direction5',
        color: '#feca57',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    }
]

export default function BetterFloatingNavigation() {
    const cardsRef = useRef([])
    const rotationAngleRef = useRef(0)
    const animationFrameRef = useRef(null)
    const tiltRefs = useRef([]) // Храним текущие значения tilt для каждой карточки

    useEffect(() => {
        // Радиус от центра логотипа до центра карточки
        const radius = 350 // Расстояние от центра логотипа до центра карточки
        const rotationSpeed = 0.25 // градусов за кадр (уменьшено в два раза)

        const getLogoCenter = () => {
            // Получаем реальную позицию логотипа через DOM
            const logoElement = document.querySelector('.logo')
            if (logoElement) {
                const rect = logoElement.getBoundingClientRect()
                // Центр логотипа = позиция + половина размера
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                return { x: centerX, y: centerY }
            }
            // Fallback на центр экрана, если логотип не найден
            return {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            }
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
                const tilt = tiltRefs.current[index] || { rotateX: 0, rotateY: 0 }

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
            })

            // Увеличиваем угол вращения
            rotationAngleRef.current += rotationSpeed

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
    }, [])

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

    const handleCardMouseLeave = (index) => {
        // Плавно сбрасываем tilt эффект
        const card = cardsRef.current[index]
        if (!card) return

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
                        <div className="card-image-wrapper">
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={200}
                                height={200}
                                className="card-image"
                                unoptimized
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
