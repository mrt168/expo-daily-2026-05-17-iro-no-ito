#!/usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
APP="$(cd "$HERE/.." && pwd)"
SHOTS="$APP/screenshots"
OUT="$HERE/out"
SPEAKER=3   # ずんだもん ノーマル

mkdir -p "$OUT" "$HERE/audio"

# 1) Synthesize voice for each scene
i=0
jq -c '.scenes[]' "$HERE/script.json" | while read -r scene; do
  i=$((i+1))
  text=$(echo "$scene" | jq -r '.narration')
  out_wav="$HERE/audio/scene_${i}.wav"
  echo "▶ Scene $i: $text"
  # audio_query
  query=$(curl -s -X POST "http://localhost:50021/audio_query?speaker=${SPEAKER}" \
    --get --data-urlencode "text=${text}")
  # synthesis
  echo "$query" | curl -s -X POST \
    -H "Content-Type: application/json" \
    -d @- \
    "http://localhost:50021/synthesis?speaker=${SPEAKER}" \
    -o "$out_wav"
done

# 2) Build per-scene video (image + audio) at 1080x1920 (Shorts)
i=0
concat_list="$HERE/concat.txt"
> "$concat_list"
jq -c '.scenes[]' "$HERE/script.json" | while read -r scene; do
  i=$((i+1))
  img=$(echo "$scene" | jq -r '.image')
  wav="$HERE/audio/scene_${i}.wav"
  out_mp4="$OUT/scene_${i}.mp4"
  # get audio duration
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$wav")
  # pad to min 4s
  if (( $(echo "$dur < 4" | bc -l 2>/dev/null || python3 -c "print(int($dur < 4))") )); then dur=4; fi
  ffmpeg -y -loop 1 -i "$SHOTS/$img" -i "$wav" \
    -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=#FBF7F2,setsar=1" \
    -c:v libx264 -pix_fmt yuv420p -t "$dur" \
    -c:a aac -b:a 128k -shortest \
    "$out_mp4" -hide_banner -loglevel error
  echo "file '$out_mp4'" >> "$concat_list"
done

# 3) Concat all scenes
ffmpeg -y -f concat -safe 0 -i "$concat_list" -c copy "$OUT/promo.mp4" -hide_banner -loglevel error
echo "DONE: $OUT/promo.mp4"
ls -lh "$OUT/promo.mp4"
