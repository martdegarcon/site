'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function Contacts() {
    const contactsRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(contactsRef.current,
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 0.7,
                duration: 0.8,
                delay: 1
            }
        )
    }, [])

    return (
        <footer className="contacts" ref={contactsRef}>
            <p>Телефон: +7 (XXX) XXX-XX-XX</p>
            <p>Email: info@example.com</p>
            <p>Адрес: Ваш адрес</p>
        </footer>
    )
}