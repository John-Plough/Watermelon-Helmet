const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const placeholder = new Image();
placeholder.src = "placeholder.jpg";

placeholder.onload = () => {
  ctx.drawImage(placeholder, 0, 0, canvas.width, canvas.height);
};

let currentName = "Anonymous";
let selfie = new Image();
let helmet = new Image();
helmet.src = "helmet.png";

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    selfie.onload = () => drawHelmet();
    selfie.src = reader.result;
  };
  reader.readAsDataURL(file);
});

const watermelonRealms = [
  "Melonmere",
  "The Rindlands",
  "Kingdom of Kooléa",
  "Juicetide",
  "Sweetvale",
  "The Crowned Patch",
  "Melonia Prime",
  "The Verdant Rind",
  "Sovereign Slice",
  "Rindreach",
  "Seedwick",
  "Dribblefen",
  "Snaptown Hollow",
  "Spitseed Ridge",
  "Rindbury-on-the-Flesh",
  "Pipwick Vale",
  "Dewbottom Downs",
  "Gushgrove",
  "Redcore Hamlet",
  "Slurpfield",
  "The Crimson Dominion",
  "Rindshelm",
  "Zesthollow",
  "The Shaded Grove of Mel’Na’Thon",
  "Juicelore",
  "The Great Gourdhold",
  "Seedspire",
  "The Melonspire Expanse",
  "Temple of the Everjuice",
  "The Corelands",
];
const titles = ["Sir", "Duke", "Squire", "Prince", "Count", "Knight", "Baron", "Melonlord", "Marquess"];

function getKnightName(name) {
  const title = titles[Math.floor(Math.random() * titles.length)];
  const realm = watermelonRealms[Math.floor(Math.random() * watermelonRealms.length)];
  return `${title} ${name} of ${realm}`;
}

// Helper function to wrap long text across lines
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  lines.forEach((lineText, index) => {
    ctx.strokeText(lineText, x, y + index * lineHeight);
    ctx.fillText(lineText, x, y + index * lineHeight);
  });
}

async function drawHelmet() {
  currentName = document.getElementById("nameInput").value || "Anonymous";

  await faceapi.nets.tinyFaceDetector.loadFromUri("https://justadudewhohacks.github.io/face-api.js/models");
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri("https://justadudewhohacks.github.io/face-api.js/models");

  canvas.width = 450;
  canvas.height = 450;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(selfie, 0, 0, canvas.width, canvas.height);

  const detections = await faceapi
    .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true);

  if (detections) {
    const landmarks = detections.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const userLeftEye = leftEye[0];
    const userRightEye = rightEye[3];

    const userEyeCenterX = (userLeftEye.x + userRightEye.x) / 2;
    const userEyeCenterY = (userLeftEye.y + userRightEye.y) / 2;

    const userEyeDistance = Math.hypot(userRightEye.x - userLeftEye.x, userRightEye.y - userLeftEye.y);

    const helmetEyeDistance = 305.0;

    const scaleAdjustment = 0.8;
    const scale = (userEyeDistance / helmetEyeDistance) * scaleAdjustment;

    const helmetWidth = helmet.width * scale;
    const helmetHeight = helmet.height * scale;

    const helmetEyeCenterX = (270 + 575) / 2;
    const helmetEyeCenterY = (512 + 512) / 2;

    const drawX = userEyeCenterX - helmetEyeCenterX * scale;
    const drawY = userEyeCenterY - helmetEyeCenterY * scale;

    ctx.drawImage(helmet, drawX, drawY, helmetWidth, helmetHeight);
  } else {
    ctx.drawImage(helmet, 75, 75, 300, 300);
  }

  const knightName = getKnightName(currentName);

  document.fonts.load('22px "MedievalSharp"').then(() => {
    const knightTextY = canvas.height - 90;
    ctx.font = "22px MedievalSharp";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.textAlign = "center";

    // Drop shadow for visibility
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;

    // Wrap long names
    wrapText(ctx, knightName, canvas.width / 2, knightTextY, canvas.width - 40, 26);
  });
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "watermelon-knight.png";
  link.href = canvas.toDataURL();
  link.click();
}
