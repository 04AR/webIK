const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Link lengths
const link1Length = 150;
const link2Length = 150;

// Arm origin position
const originX = canvas.width / 2;
const originY = canvas.height / 2;

// Mouse position
let targetX = originX;
let targetY = originY;

// Track mouse position
canvas.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
});


function drawArm() {
    // Calculate distance to target
    const dx = targetX - originX;
    const dy = targetY - originY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Clamp the distance to be within the reach of the arm
    const maxReach = link1Length + link2Length;
    const clampedDistance = Math.min(distance, maxReach);

    // Calculate inverse kinematics angles for 2-joint arm
    const cosAngle2 = (clampedDistance ** 2 - link1Length ** 2 - link2Length ** 2) / (2 * link1Length * link2Length);
    const angle2 = Math.acos(Math.max(-1, Math.min(1, cosAngle2))); // Angle for second joint

    const angle1 = Math.atan2(dy, dx) - Math.atan2(
        link2Length * Math.sin(angle2),
        link1Length + link2Length * Math.cos(angle2)
    ); // Angle for first joint

    // Convert angles to degrees for display
    const angle1Deg = angle1 * (180 / Math.PI);
    const angle2Deg = angle2 * (180 / Math.PI);

    // Calculate joint positions based on angles
    const x1 = originX + link1Length * Math.cos(angle1);
    const y1 = originY + link1Length * Math.sin(angle1);

    const x2 = x1 + link2Length * Math.cos(angle1 + angle2);
    const y2 = y1 + link2Length * Math.sin(angle1 + angle2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#61dafb";

    // Link 1
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Link 2
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw joints
    ctx.fillStyle = "#61dafb";
    ctx.beginPath();
    ctx.arc(originX, originY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x1, y1, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x2, y2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw angle annotations
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.fillText(`θ1: ${-angle1Deg.toFixed(2)}°`, canvas.width / 2 , canvas.height / 2); // Angle at joint 1
    ctx.fillText(`θ2: ${angle2Deg.toFixed(2)}°`, x1 - 60, y1 - 10); // Angle at joint 2

    

ctx.fillText(`INVERSE KINEMATICS`, (canvas.width / 2) , (canvas.height / 2) + 30);

    requestAnimationFrame(drawArm);
}

// Start drawing
drawArm();
