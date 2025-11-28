'use client'

import { useRef, useEffect } from 'react'

export default function Logo() {
    const logoRef = useRef(null)
    const logoInnerRef = useRef(null)

    useEffect(() => {
        // Позиционируем логотип точно по центру экрана (как и карточки)
        const updateLogoPosition = () => {
            if (!logoRef.current) return

            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2 - 100 // Смещено вверх на 100px

            logoRef.current.style.left = `${centerX}px`
            logoRef.current.style.top = `${centerY}px`
        }

        updateLogoPosition()
        window.addEventListener('resize', updateLogoPosition)

        const handleMouseMove = (e) => {
            if (!logoInnerRef.current) return

            const rect = logoInnerRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const mouseX = e.clientX - centerX
            const mouseY = e.clientY - centerY

            // Вычисляем углы наклона (максимум 15 градусов)
            const rotateX = (mouseY / (rect.height / 2)) * -15
            const rotateY = (mouseX / (rect.width / 2)) * 15

            // Применяем трансформацию
            logoInnerRef.current.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `
        }

        const handleMouseLeave = () => {
            if (!logoInnerRef.current) return
            logoInnerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
        }

        const logoElement = logoRef.current
        if (logoElement) {
            logoElement.addEventListener('mousemove', handleMouseMove)
            logoElement.addEventListener('mouseleave', handleMouseLeave)
        }

        return () => {
            window.removeEventListener('resize', updateLogoPosition)
            if (logoElement) {
                logoElement.removeEventListener('mousemove', handleMouseMove)
                logoElement.removeEventListener('mouseleave', handleMouseLeave)
            }
        }
    }, [])

    return (
        <div className="logo" ref={logoRef}>
            <div
                ref={logoInnerRef}
                style={{
                    width: '200px',
                    height: '200px',
                    background: '#808080',
                    position: 'relative',
                    transition: 'transform 0.1s ease-out',
                    transformStyle: 'preserve-3d'
                }}
            />
        </div>
    )
}