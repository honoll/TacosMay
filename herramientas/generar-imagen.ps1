# Genera variantes de una pieza con el generador de imágenes de Antigravity (agy) y las
# copia a -Out con el prefijo -Name. La referencia (pieza maestra) se pasa por ruta.
param(
    [Parameter(Mandatory)] [string] $Name,
    [Parameter(Mandatory)] [string] $Subject,
    [string] $Fixed = 'Photographed from directly above, perfectly top-down (90 degrees). Even, soft, slightly warm overhead kitchen light, no hard shadows, no glare, no blown highlights. Everything in sharp focus, no depth-of-field blur, no vignette. Natural true-to-life colors, not oversaturated, no filters. Real homestyle Mexican taqueria food, freshly served, moist, a little messy and imperfect, not styled like fine dining or advertising. No text, no letters, no logos, no watermark, no hands, no people, no cutlery, no spoon, no plate decoration, no garnish that is not listed, no steam, no border, no frame. Square image.',
    [string] $Ref,
    [string] $Out = "$PSScriptRoot\out",
    [int] $Variants = 3
)
$brain = "$env:USERPROFILE\.gemini\antigravity-cli\brain"
New-Item -ItemType Directory -Force $Out | Out-Null
$refText = if ($Ref) { "Attach the image file at this absolute path as the style reference input for every generation: $Ref . Match its lighting, color temperature, level of detail and realism exactly, as if photographed at the same counter in the same session; do NOT copy its subject. " } else { '' }
$prompt = "Use your image-generator subagent to generate exactly $Variants separate square image variants of the same prompt, and nothing else. Do not post-process, crop or 'fix' them, do not create, edit or delete any other file, and do not run shell commands. $refText" +
    "Prompt: $Subject $Fixed " +
    "When done, reply with only: the absolute paths of the saved image files, whether the reference image was actually passed to the image model as an input (yes/no), and any quota or limit message you saw."
$before = Get-Date
Push-Location $PSScriptRoot
agy --sandbox --print-timeout 480s --print $prompt 2>&1 | Select-Object -Last 8
Pop-Location
$i = 0
Get-ChildItem $brain -Recurse -File -Include *.png, *.jpg, *.jpeg, *.webp |
    Where-Object LastWriteTime -gt $before | Sort-Object LastWriteTime | ForEach-Object {
        $i++; Copy-Item $_.FullName (Join-Path $Out ("{0}-v{1:d2}{2}" -f $Name, $i, $_.Extension))
    }
"$Name -> $i archivos en $Out"
