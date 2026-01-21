# Spherical Region Visualizer

An interactive 3D visualization tool designed to help Calculus 3 (Multivariable Calculus) students understand spherical coordinates. This tool allows users to define boundaries for **ρ (rho)**, **φ (phi)**, and **θ (theta)** to visualize integration regions in real-time.

## 🚀 Features

- **Real-Time 3D Rendering**: Instantly visualizes spherical wedges, cones, and spheres using Plotly.js.
- **Interactive Controls**: Adjust min/max values for:
  - Radius ($\rho$)
  - Polar Angle ($\phi$)
  - Azimuthal Angle ($\theta$)
- **Smart Input Parsing**: Automatically recognizes and converts "pi" or "π" inputs (e.g., entering `2pi` becomes `6.28...`).
- **Interactive Plot**: Zoom, pan, and rotate the 3D model to inspect the region from any angle.

## 🛠️ Technologies Used

- **HTML5 & CSS3**: Structure and styling.
- **JavaScript (ES6+)**: Logic for coordinate transformation and input parsing.
- **[Plotly.js](https://plotly.com/javascript/)**: 3D graphing library.

## 📂 File Structure

```text
Spherical-Visualizer/
├── index.html          # Main application file
└── src/
    ├── styles/
    │   └── styles.css  # Custom styling
    └── scripts/
        └── script.js   # Math logic and Plotly rendering
```
## 📦 Setup & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ble27/Spherical-Visualizer.git

2. **Open the application:**
   - No build step required. Simply open `index.html` in any modern web browser.


## 📝 Input Guide

The input fields accept standard numbers and math expressions involving Pi. You can type "pi" directly, and the tool will convert it to the symbol π.

**Examples:**
- `pi` or `π` → Renders as **3.14159...**
- `pi/2` → Renders as **1.57...**
- `2pi` → Renders as **6.28...**