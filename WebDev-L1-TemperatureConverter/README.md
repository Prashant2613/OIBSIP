# 🌡️ Tempera - Temperature Converter

![Tempera Temperature Converter](screenshots/desktop.png)

A modern, responsive, and accessible temperature conversion web application built for the **Oasis Infobyte Web Development & Designing Internship (Level 1, Task 3)**.

---

## 📋 Project Overview

**Tempera** is a polished temperature converter that allows users to seamlessly convert between Celsius, Fahrenheit, and Kelvin.

Built with **Vanilla HTML5, CSS3, and JavaScript**, the project demonstrates clean code architecture, modern UI/UX principles, responsive design, and robust input validation including absolute-zero boundary checking.

---

## 🎯 Internship Details

| Detail | Information |
|--------|-------------|
| **Organization** | Oasis Infobyte |
| **Track** | Web Development & Designing |
| **Level** | Level 1 |
| **Task** | Task 3 — Temperature Converter Website |

---

## ✨ Features

### Core Functionality

- **Three-unit support:** Celsius (°C), Fahrenheit (°F), Kelvin (K)
- **Bidirectional conversion:** Input any unit and get all three results
- **Real-time validation:** Instant feedback on input errors
- **Absolute zero enforcement:** Prevents physically impossible temperatures
- **Precise calculations:** Mathematically correct formulas with 2-decimal precision

### Validation & Error Handling

- ✅ Empty input detection
- ✅ Non-numeric input rejection
- ✅ Absolute zero boundary validation per unit
- ✅ Friendly, inline error messages
- ✅ Accessible error announcements using ARIA live regions

### User Experience

- **Glassmorphism design** with animated gradient background
- **Smooth micro-interactions** including hover and focus states
- **Keyboard navigation** support
- **Responsive layout** for mobile, tablet, and desktop
- **High contrast** interface
- **Reduced motion support**
- **Print-friendly** stylesheet

### Accessibility

- Semantic HTML5 structure
- Proper `<label>` associations
- ARIA attributes such as `aria-live`, `aria-invalid`, and `aria-busy`
- Focus-visible outlines
- Accessible color contrast
- Screen-reader-friendly structure

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure and accessibility |
| **CSS3** | Styling, animations, responsive design |
| **Vanilla JavaScript (ES6+)** | Conversion logic, validation, DOM manipulation |
| **Google Fonts (Inter)** | Professional typography |
| **CSS Custom Properties** | Consistent theming and maintainability |

**No frameworks, libraries, or build tools** — pure, beginner-friendly vanilla code.

---

## 🔬 Conversion Formulas

| From | To | Formula |
|------|-----|---------|
| Celsius | Fahrenheit | `°F = (°C × 9/5) + 32` |
| Fahrenheit | Celsius | `°C = (°F − 32) × 5/9` |
| Celsius | Kelvin | `K = °C + 273.15` |
| Kelvin | Celsius | `°C = K − 273.15` |
| Fahrenheit | Kelvin | `K = (°F − 32) × 5/9 + 273.15` |
| Kelvin | Fahrenheit | `°F = (K − 273.15) × 9/5 + 32` |

---

## 🚫 Absolute Zero Limits

| Unit | Absolute Zero Limit |
|------|---------------------|
| Celsius | −273.15 °C |
| Fahrenheit | −459.67 °F |
| Kelvin | 0 K |

Temperatures below these limits are rejected with a clear and user-friendly error message.

---

## 📂 Project Structure

```text
WebDev-L1-TemperatureConverter/
│
├── index.html
│       └── Main HTML structure and interface
│
├── style.css
│       └── Styling, layout, responsive design, and animations
│
├── script.js
│       └── Temperature conversion logic and validation
│
├── screenshots/
│   ├── desktop.png
│   └── mobile.png
│
└── README.md
