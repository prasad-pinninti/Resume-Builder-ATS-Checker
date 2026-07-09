import fs from "fs";
import path from "path";

const sourceDir = "C:/Users/PINNINTI PRASAD/.gemini/antigravity/brain/2f54e0e4-c72a-4696-98d9-5ae55f7739f5";
const destDir = path.join("frontend", "public");

const filesToCopy = [
  { srcName: "classic_1783504041036.png", destName: "classic.png" },
  { srcName: "modern_1783504085834.png", destName: "modern.png" },
  { srcName: "minimal_image_1783504133485.png", destName: "minimal_image.png" },
  { srcName: "minimal_1783504174427.png", destName: "minimal.png" },
  { srcName: "ats_1783504340715.png", destName: "ats.png" }
];

try {
  // Ensure destination directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  filesToCopy.forEach(({ srcName, destName }) => {
    const srcPath = path.join(sourceDir, srcName);
    const destPath = path.join(destDir, destName);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcName} -> ${destPath} successfully!`);
    } else {
      console.error(`Source file not found: ${srcPath}`);
    }
  });

  console.log("All preview images successfully copied!");
} catch (error) {
  console.error("Error copying images:", error);
}
