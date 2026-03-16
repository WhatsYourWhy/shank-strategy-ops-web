import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  copyFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

type Manifest = {
  name: string;
  width?: number;
  height?: number;
  fps?: number;
  defaultDuration?: number;
  clipsDir?: string;
  output?: string;
  style?: StyleConfig;
  audio?: AudioConfig;
  shots: ShotConfig[];
};

type StyleConfig = {
  backgroundColor?: string;
  overlayOpacity?: number;
  textBoxOpacity?: number;
  accentColor?: string;
  textColor?: string;
  shadowColor?: string;
  boxMarginX?: number;
  boxMarginBottom?: number;
  boxPaddingX?: number;
  boxPaddingTop?: number;
  boxPaddingBottom?: number;
  accentBarHeight?: number;
  headlineFontSize?: number;
  headlineLineGap?: number;
  kickerFontSize?: number;
  fontFile?: string;
  fontCandidates?: string[];
};

type AudioConfig = {
  music?: string;
  narration?: string;
  musicVolume?: number;
  narrationVolume?: number;
};

type ShotConfig = {
  input: string;
  duration?: number;
  kicker?: string;
  textLines: string[];
  voiceover?: string;
  overlayOpacity?: number;
};

type CliOptions = {
  config: string;
  clipsDir?: string;
  output?: string;
  music?: string;
  narration?: string;
  keepTemp?: boolean;
};

const DEFAULT_STYLE: Required<
  Omit<StyleConfig, "fontCandidates" | "fontFile">
> & { fontCandidates: string[] } = {
  backgroundColor: "black",
  overlayOpacity: 0.18,
  textBoxOpacity: 0.72,
  accentColor: "#c65a1e",
  textColor: "#f3eee4",
  shadowColor: "black",
  boxMarginX: 64,
  boxMarginBottom: 56,
  boxPaddingX: 34,
  boxPaddingTop: 28,
  boxPaddingBottom: 34,
  accentBarHeight: 8,
  headlineFontSize: 54,
  headlineLineGap: 10,
  kickerFontSize: 20,
  fontCandidates: [
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/bahnschrift.ttf",
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/impact.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  ],
};

function main() {
  const options = parseArgs(process.argv.slice(2));
  const configPath = path.resolve(options.config);

  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const manifest = JSON.parse(readFileSync(configPath, "utf8")) as Manifest;
  const baseDir = path.dirname(configPath);
  const width = manifest.width ?? 1280;
  const height = manifest.height ?? 720;
  const fps = manifest.fps ?? 30;
  const clipsDir = options.clipsDir
    ? path.resolve(options.clipsDir)
    : path.resolve(baseDir, manifest.clipsDir ?? ".");
  const outputPath = options.output
    ? path.resolve(options.output)
    : path.resolve(baseDir, manifest.output ?? "out/ad.mp4");
  const totalDuration = manifest.shots.reduce(
    (sum, shot) => sum + (shot.duration ?? manifest.defaultDuration ?? 4),
    0
  );

  ensureBinary(ffmpegPath, "ffmpeg");
  ensureBinary(ffprobeStatic.path, "ffprobe");

  const style = {
    ...DEFAULT_STYLE,
    ...manifest.style,
    fontCandidates: manifest.style?.fontCandidates ?? DEFAULT_STYLE.fontCandidates,
  };
  const fontFile = resolveFontFile(style.fontFile, style.fontCandidates);

  const missingShots = manifest.shots
    .map((shot) => resolveShotInput(clipsDir, shot.input))
    .filter((shotPath) => !existsSync(shotPath));
  if (missingShots.length > 0) {
    throw new Error(
      `Missing input clips:\n${missingShots.map((shotPath) => `- ${shotPath}`).join("\n")}`
    );
  }

  mkdirSync(path.dirname(outputPath), { recursive: true });

  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "shank-ad-render-"));

  try {
    const renderedShots = manifest.shots.map((shot, index) => {
      const inputPath = resolveShotInput(clipsDir, shot.input);
      const outputShotPath = path.join(tempRoot, `${String(index + 1).padStart(2, "0")}.mp4`);
      renderShot({
        inputPath,
        outputShotPath,
        shot,
        style,
        fontFile,
        width,
        height,
        fps,
        tempRoot,
        defaultDuration: manifest.defaultDuration ?? 4,
      });
      return outputShotPath;
    });

    const concatListPath = path.join(tempRoot, "concat.txt");
    writeFileSync(
      concatListPath,
      renderedShots
        .map((shotPath) => `file '${toConcatPath(shotPath)}'`)
        .join("\n"),
      "utf8"
    );

    const silentOutputPath = path.join(tempRoot, "assembled-silent.mp4");
    runFfmpeg([
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatListPath,
      "-c",
      "copy",
      silentOutputPath,
    ]);

    const musicPath = resolveOptionalPath(baseDir, options.music, manifest.audio?.music);
    const narrationPath = resolveOptionalPath(
      baseDir,
      options.narration,
      manifest.audio?.narration
    );

    if (musicPath || narrationPath) {
      addAudioTrack({
        silentVideoPath: silentOutputPath,
        outputPath,
        musicPath,
        narrationPath,
        totalDuration,
        audio: manifest.audio,
      });
    } else {
      copyFileSync(silentOutputPath, outputPath);
    }

    writeCompanionScript(outputPath, manifest);

    console.log(`Rendered ad: ${outputPath}`);
  } finally {
    if (!options.keepTemp) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  }
}

function renderShot(input: {
  inputPath: string;
  outputShotPath: string;
  shot: ShotConfig;
  style: typeof DEFAULT_STYLE & StyleConfig;
  fontFile: string;
  width: number;
  height: number;
  fps: number;
  tempRoot: string;
  defaultDuration: number;
}) {
  const sourceDuration = probeDuration(input.inputPath);
  const targetDuration = input.shot.duration ?? input.defaultDuration;
  const freezeTail = Math.max(0, targetDuration - sourceDuration);
  const textFiles = input.shot.textLines.map((line, index) => {
    const textFile = path.join(
      input.tempRoot,
      `${path.basename(input.outputShotPath, ".mp4")}-line-${index + 1}.txt`
    );
    writeFileSync(textFile, line, "utf8");
    return textFile;
  });
  const kickerFile = input.shot.kicker
    ? path.join(input.tempRoot, `${path.basename(input.outputShotPath, ".mp4")}-kicker.txt`)
    : undefined;
  if (kickerFile && input.shot.kicker) {
    writeFileSync(kickerFile, input.shot.kicker, "utf8");
  }

  const boxX = input.style.boxMarginX;
  const boxWidth = input.width - boxX * 2;
  const headlineCount = input.shot.textLines.length;
  const textBlockHeight =
    input.style.headlineFontSize * headlineCount +
    input.style.headlineLineGap * Math.max(0, headlineCount - 1);
  const kickerHeight = input.shot.kicker ? input.style.kickerFontSize + 14 : 0;
  const boxHeight =
    input.style.boxPaddingTop +
    kickerHeight +
    textBlockHeight +
    input.style.boxPaddingBottom +
    input.style.accentBarHeight;
  const boxY = input.height - input.style.boxMarginBottom - boxHeight;
  const textStartY = boxY + input.style.boxPaddingTop + kickerHeight;
  const overlayOpacity = input.shot.overlayOpacity ?? input.style.overlayOpacity;

  const filters = [
    `scale=w=${input.width}:h=${input.height}:force_original_aspect_ratio=decrease:flags=lanczos`,
    `pad=${input.width}:${input.height}:(ow-iw)/2:(oh-ih)/2:color=${input.style.backgroundColor}`,
  ];

  if (freezeTail > 0.01) {
    filters.push(`tpad=stop_mode=clone:stop_duration=${freezeTail.toFixed(3)}`);
  }

  filters.push(`trim=duration=${targetDuration}`);
  filters.push("setpts=PTS-STARTPTS");
  filters.push(
    `drawbox=x=0:y=0:w=iw:h=ih:color=black@${overlayOpacity.toFixed(2)}:t=fill`
  );
  filters.push(
    `drawbox=x=${boxX}:y=${boxY}:w=${boxWidth}:h=${boxHeight}:color=black@${input.style.textBoxOpacity.toFixed(
      2
    )}:t=fill`
  );
  filters.push(
    `drawbox=x=${boxX}:y=${boxY}:w=${boxWidth}:h=${input.style.accentBarHeight}:color=${input.style.accentColor}:t=fill`
  );

  if (kickerFile) {
    filters.push(
      drawTextFilter({
        fontFile: input.fontFile,
        textFile: kickerFile,
        color: input.style.accentColor,
        size: input.style.kickerFontSize,
        x: boxX + input.style.boxPaddingX,
        y: boxY + input.style.boxPaddingTop,
        shadowColor: input.style.shadowColor,
      })
    );
  }

  textFiles.forEach((textFile, index) => {
    filters.push(
      drawTextFilter({
        fontFile: input.fontFile,
        textFile,
        color: input.style.textColor,
        size: input.style.headlineFontSize,
        x: boxX + input.style.boxPaddingX,
        y:
          textStartY +
          index * (input.style.headlineFontSize + input.style.headlineLineGap),
        shadowColor: input.style.shadowColor,
      })
    );
  });

  runFfmpeg([
    "-y",
    "-i",
    input.inputPath,
    "-an",
    "-vf",
    filters.join(","),
    "-r",
    String(input.fps),
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    input.outputShotPath,
  ]);
}

function addAudioTrack(input: {
  silentVideoPath: string;
  outputPath: string;
  musicPath?: string;
  narrationPath?: string;
  totalDuration: number;
  audio?: AudioConfig;
}) {
  const args = ["-y", "-i", input.silentVideoPath];
  const filterParts: string[] = [];
  let currentInput = 1;
  const finalInputs: string[] = [];

  if (input.musicPath) {
    args.push("-stream_loop", "-1", "-i", input.musicPath);
    filterParts.push(
      `[${currentInput}:a]volume=${input.audio?.musicVolume ?? 0.35},atrim=duration=${input.totalDuration.toFixed(
        3
      )}[music]`
    );
    finalInputs.push("[music]");
    currentInput += 1;
  }

  if (input.narrationPath) {
    args.push("-i", input.narrationPath);
    filterParts.push(
      `[${currentInput}:a]volume=${input.audio?.narrationVolume ?? 1}[narration]`
    );
    finalInputs.push("[narration]");
  }

  if (finalInputs.length === 0) {
    copyFileSync(input.silentVideoPath, input.outputPath);
    return;
  }

  if (finalInputs.length === 1) {
    filterParts.push(`${finalInputs[0]}anull[aout]`);
  } else {
    filterParts.push(`${finalInputs.join("")}amix=inputs=${finalInputs.length}:normalize=0[aout]`);
  }

  runFfmpeg([
    ...args,
    "-filter_complex",
    filterParts.join(";"),
    "-map",
    "0:v:0",
    "-map",
    "[aout]",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    input.outputPath,
  ]);
}

function drawTextFilter(input: {
  fontFile: string;
  textFile: string;
  color: string;
  size: number;
  x: number;
  y: number;
  shadowColor: string;
}) {
  return `drawtext=${[
    `fontfile='${escapeFilterPath(input.fontFile)}'`,
    `textfile='${escapeFilterPath(input.textFile)}'`,
    "reload=0",
    `fontcolor=${input.color}`,
    `fontsize=${input.size}`,
    `x=${input.x}`,
    `y=${input.y}`,
    `shadowcolor=${input.shadowColor}`,
    "shadowx=2",
    "shadowy=2",
  ].join(":")}`;
}

function parseArgs(argv: string[]): CliOptions {
  const options: Partial<CliOptions> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    switch (current) {
      case "--config":
        options.config = next;
        index += 1;
        break;
      case "--clips-dir":
        options.clipsDir = next;
        index += 1;
        break;
      case "--output":
        options.output = next;
        index += 1;
        break;
      case "--music":
        options.music = next;
        index += 1;
        break;
      case "--narration":
        options.narration = next;
        index += 1;
        break;
      case "--keep-temp":
        options.keepTemp = true;
        break;
      default:
        throw new Error(`Unknown argument: ${current}`);
    }
  }

  if (!options.config) {
    throw new Error("Missing required argument: --config <path>");
  }

  return options as CliOptions;
}

function resolveShotInput(clipsDir: string, inputPath: string) {
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(clipsDir, inputPath);
}

function resolveOptionalPath(
  baseDir: string,
  cliInputPath?: string,
  manifestInputPath?: string
) {
  if (cliInputPath) {
    return path.isAbsolute(cliInputPath)
      ? cliInputPath
      : path.resolve(cliInputPath);
  }

  if (!manifestInputPath) {
    return undefined;
  }

  return path.isAbsolute(manifestInputPath)
    ? manifestInputPath
    : path.resolve(baseDir, manifestInputPath);
}

function resolveFontFile(fontFile: string | undefined, candidates: string[]) {
  const resolved = fontFile ? [fontFile, ...candidates] : candidates;
  const match = resolved.find((candidate) => existsSync(candidate));

  if (!match) {
    throw new Error(
      `No usable font file found. Checked:\n${resolved.map((candidate) => `- ${candidate}`).join("\n")}`
    );
  }

  return match;
}

function probeDuration(inputPath: string) {
  const output = execFileSync(ffprobeStatic.path, [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    inputPath,
  ]);

  const parsed = Number(output.toString("utf8").trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Unable to read duration for ${inputPath}`);
  }

  return parsed;
}

function runFfmpeg(args: string[]) {
  execFileSync(ffmpegPath as string, args, { stdio: "pipe" });
}

function ensureBinary(binaryPath: string | null, label: string) {
  if (!binaryPath || !existsSync(binaryPath)) {
    throw new Error(`${label} binary not available at ${binaryPath ?? "<null>"}`);
  }
}

function toConcatPath(filePath: string) {
  return filePath.replace(/\\/g, "/").replace(/'/g, "'\\''");
}

function escapeFilterPath(filePath: string) {
  return filePath.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'");
}

function writeCompanionScript(outputPath: string, manifest: Manifest) {
  const voiceoverLines = manifest.shots
    .map((shot, index) => {
      const label = String(index + 1).padStart(2, "0");
      const headline = shot.textLines.join(" / ");
      const narration = shot.voiceover ?? "(No voiceover line set)";
      return `${label}. ${headline}\n   ${narration}`;
    })
    .join("\n\n");

  const scriptPath = outputPath.replace(/\.mp4$/i, "-script.txt");
  writeFileSync(
    scriptPath,
    `${manifest.name}\n\n${voiceoverLines}\n`,
    "utf8"
  );
}

main();
