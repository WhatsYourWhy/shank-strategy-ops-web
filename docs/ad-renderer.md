# Ad Renderer

This workflow treats AI-generated videos as silent background plates and makes the final ad deterministic:

- exact on-screen text
- exact sequencing
- consistent lower-third treatment
- optional music and narration

## Default workflow

1. Put your rendered clips in [out/sora](/C:/Users/Justin/shank-strategy-ops-web/out/sora) using the filenames listed in [shank-investor-ad.json](/C:/Users/Justin/shank-strategy-ops-web/scripts/ad-manifests/shank-investor-ad.json).
2. Run:

```powershell
corepack pnpm render:ad
```

3. The finished ad is written to [out/ads/shank-investor-ad.mp4](/C:/Users/Justin/shank-strategy-ops-web/out/ads/shank-investor-ad.mp4).

The renderer also writes a companion voiceover reference file next to the video:

- [out/ads/shank-investor-ad-script.txt](/C:/Users/Justin/shank-strategy-ops-web/out/ads/shank-investor-ad-script.txt)

## Useful overrides

```powershell
corepack pnpm tsx scripts/render-ad.ts `
  --config scripts/ad-manifests/shank-investor-ad.json `
  --clips-dir out/sora `
  --output out/ads/shank-investor-ad-v2.mp4 `
  --music assets/audio/bed.mp3 `
  --narration assets/audio/voiceover.wav
```

## Notes

- The script uses bundled `ffmpeg-static` and `ffprobe-static`, so it does not require a global FFmpeg install.
- Input clips can be longer or shorter than the target duration. Longer clips are trimmed; shorter clips freeze on the last frame to fill the slot.
- If you want a different text treatment or a different sequence, edit the manifest instead of editing the renderer.
