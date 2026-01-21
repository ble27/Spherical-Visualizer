const n_points = 100;

// Generates an array of n linearly spaced points between start and end.
function linspace(start, end, n) {
    const arr = [];
    const step = (end - start) / (n - 1);
    for (let i = 0; i < n; i++) {
        arr.push(start + step * i);
    }
    return arr;
}

// Creates coordinate matrices from two coordinate vectors for 3D surface plotting.
function meshgrid(x, y) {
    const X = [];
    const Y = [];
    for (let i = 0; i < y.length; i++) {
        X.push([...x]);
        Y.push(new Array(x.length).fill(y[i]));
    }
    return [X, Y];
}

// Parses string input into numbers, handling 'pi' symbols and math expressions safely.
function parseInput(value) {
    let str = String(value).trim();
    let displayStr = str.toLowerCase().replace(/pi/g, 'π');
    let numValue = str.toLowerCase();
    
    numValue = numValue.replace(/(\d+\.?\d*)\s*\*?\s*(π|pi)/g, function(match, num, pi) {
        return num + '*' + Math.PI;
    });
    
    numValue = numValue.replace(/(?<!\d)(π|pi)(?!\d)/g, Math.PI);
    
    try {
        const result = Function(`'use strict'; return (${numValue})`)();
        return { display: displayStr, numeric: result };
    } catch (e) {
        const num = parseFloat(numValue);
        return { display: displayStr, numeric: isNaN(num) ? 0 : num };
    }
}

// Adds event listeners to input fields to handle 'pi' formatting and Enter key submission.
function setupPiConversion(inputId) {
    const input = document.getElementById(inputId);
    
    input.addEventListener('blur', function() {
        const parsed = parseInput(this.value);
        this.value = parsed.display;
    });
    
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const parsed = parseInput(this.value);
            this.value = parsed.display;
            updatePlot();
        }
    });
}

// Generates the 3D surface traces (sphere, cone, wedges) using Plotly based on spherical coordinates.
function createSphericalPlot(rho_min, rho_max, phi_min, phi_max, theta_min, theta_max) {
    const phi_vals = linspace(phi_min, phi_max, n_points);
    const theta_vals = linspace(theta_min, theta_max, n_points);
    const [PHI, THETA] = meshgrid(phi_vals, theta_vals);

    const X = [], Y = [], Z = [];
    for (let i = 0; i < n_points; i++) {
        X[i] = [];
        Y[i] = [];
        Z[i] = [];
        for (let j = 0; j < n_points; j++) {
            const phi = PHI[i][j];
            const theta = THETA[i][j];
            X[i][j] = rho_max * Math.sin(phi) * Math.cos(theta);
            Y[i][j] = rho_max * Math.sin(phi) * Math.sin(theta);
            Z[i][j] = rho_max * Math.cos(phi);
        }
    }

    const traces = [{
        type: 'surface',
        x: X,
        y: Y,
        z: Z,
        colorscale: [[0, 'rgb(0, 0, 180)'], [0.5, 'rgb(0, 0, 220)'], [1, 'rgb(50, 50, 255)']],
        opacity: 1.0,
        showscale: false,
        lighting: {
            ambient: 0.4,
            diffuse: 0.8,
            specular: 0.3,
            roughness: 0.8,
            fresnel: 0.1
        },
        lightposition: {
            x: 3000,
            y: 3000,
            z: 4000
        },
        contours: {
            z: {
                show: true,
                usecolormap: true,
                highlightcolor: "rgba(255,255,255,0.1)",
                project: {z: false}
            }
        },
        name: 'Sphere'
    }];

    if (phi_max < Math.PI - 0.01) {
        const rho_cone_vals = linspace(rho_min, rho_max, n_points);
        const [THETA_cone, RHO_cone] = meshgrid(theta_vals, rho_cone_vals);
        
        const X_cone = [], Y_cone = [], Z_cone = [];
        for (let i = 0; i < n_points; i++) {
            X_cone[i] = [];
            Y_cone[i] = [];
            Z_cone[i] = [];
            for (let j = 0; j < n_points; j++) {
                const rho = RHO_cone[i][j];
                const theta = THETA_cone[i][j];
                X_cone[i][j] = rho * Math.sin(phi_max) * Math.cos(theta);
                Y_cone[i][j] = rho * Math.sin(phi_max) * Math.sin(theta);
                Z_cone[i][j] = rho * Math.cos(phi_max);
            }
        }

        traces.push({
            type: 'surface',
            x: X_cone,
            y: Y_cone,
            z: Z_cone,
            colorscale: [[0, 'rgb(150, 0, 0)'], [0.5, 'rgb(200, 0, 0)'], [1, 'rgb(255, 50, 50)']],
            opacity: 0.95,
            showscale: false,
            lighting: {
                ambient: 0.4,
                diffuse: 0.8,
                specular: 0.3,
                roughness: 0.8
            },
            name: 'Cone'
        });
    }

    if (theta_max < 2 * Math.PI - 0.01) {
        const rho_wedge_vals = linspace(rho_min, rho_max, n_points);
        const [PHI_wedge, RHO_wedge] = meshgrid(phi_vals, rho_wedge_vals);

        const X_w1 = [], Y_w1 = [], Z_w1 = [];
        for (let i = 0; i < n_points; i++) {
            X_w1[i] = [];
            Y_w1[i] = [];
            Z_w1[i] = [];
            for (let j = 0; j < n_points; j++) {
                const rho = RHO_wedge[i][j];
                const phi = PHI_wedge[i][j];
                X_w1[i][j] = rho * Math.sin(phi) * Math.cos(theta_min);
                Y_w1[i][j] = rho * Math.sin(phi) * Math.sin(theta_min);
                Z_w1[i][j] = rho * Math.cos(phi);
            }
        }

        traces.push({
            type: 'surface',
            x: X_w1,
            y: Y_w1,
            z: Z_w1,
            colorscale: [[0, 'rgb(0, 130, 0)'], [0.5, 'rgb(0, 180, 0)'], [1, 'rgb(50, 255, 50)']],
            opacity: 0.95,
            showscale: false,
            lighting: {
                ambient: 0.4,
                diffuse: 0.8,
                specular: 0.3,
                roughness: 0.8
            },
            name: 'Wedge 1'
        });

        const X_w2 = [], Y_w2 = [], Z_w2 = [];
        for (let i = 0; i < n_points; i++) {
            X_w2[i] = [];
            Y_w2[i] = [];
            Z_w2[i] = [];
            for (let j = 0; j < n_points; j++) {
                const rho = RHO_wedge[i][j];
                const phi = PHI_wedge[i][j];
                X_w2[i][j] = rho * Math.sin(phi) * Math.cos(theta_max);
                Y_w2[i][j] = rho * Math.sin(phi) * Math.sin(theta_max);
                Z_w2[i][j] = rho * Math.cos(phi);
            }
        }

        traces.push({
            type: 'surface',
            x: X_w2,
            y: Y_w2,
            z: Z_w2,
            colorscale: [[0, 'rgb(0, 130, 0)'], [0.5, 'rgb(0, 180, 0)'], [1, 'rgb(50, 255, 50)']],
            opacity: 0.95,
            showscale: false,
            lighting: {
                ambient: 0.4,
                diffuse: 0.8,
                specular: 0.3,
                roughness: 0.8
            },
            name: 'Wedge 2'
        });
    }

    const layout = {
        title: `Spherical Region: ρ=[${rho_min.toFixed(2)}, ${rho_max.toFixed(2)}], φ=[${phi_min.toFixed(2)}, ${phi_max.toFixed(2)}], θ=[${theta_min.toFixed(2)}, ${theta_max.toFixed(2)}]`,
        scene: {
            xaxis: {title: 'X'},
            yaxis: {title: 'Y'},
            zaxis: {title: 'Z'},
            aspectmode: 'data',
            aspectratio: {x: 1, y: 1, z: 1},
            camera: {
                eye: {x: 1.5, y: 1.5, z: 1.2}
            }
        },
        margin: {l: 0, r: 0, b: 0, t: 40}
    };

    Plotly.newPlot('myPlot', traces, layout);
}

// Retrieves numeric values from the DOM inputs and triggers the spherical plot creation.
function updatePlot() {
    const rho_min = parseInput(document.getElementById('rho_min').value).numeric;
    const rho_max = parseInput(document.getElementById('rho_max').value).numeric;
    const phi_min = parseInput(document.getElementById('phi_min').value).numeric;
    const phi_max = parseInput(document.getElementById('phi_max').value).numeric;
    const theta_min = parseInput(document.getElementById('theta_min').value).numeric;
    const theta_max = parseInput(document.getElementById('theta_max').value).numeric;

    createSphericalPlot(rho_min, rho_max, phi_min, phi_max, theta_min, theta_max);
}

document.getElementById('update-btn').addEventListener('click', updatePlot);

['rho_min', 'rho_max', 'phi_min', 'phi_max', 'theta_min', 'theta_max'].forEach(id => {
    setupPiConversion(id);
});

updatePlot();