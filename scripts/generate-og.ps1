Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$out = Join-Path (Resolve-Path ".") "assets\og-abinod.png"

$bitmap = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function Color($hex, $alpha = 255) {
  $hex = $hex.TrimStart("#")
  [System.Drawing.Color]::FromArgb(
    $alpha,
    [Convert]::ToInt32($hex.Substring(0, 2), 16),
    [Convert]::ToInt32($hex.Substring(2, 2), 16),
    [Convert]::ToInt32($hex.Substring(4, 2), 16)
  )
}

function Fill-Path($points, $brush) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddPolygon([System.Drawing.PointF[]]$points)
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function Draw-Keystone($cx, $cy, $scale) {
  $gold = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.RectangleF]::new($cx - 65 * $scale, $cy - 62 * $scale, 130 * $scale, 124 * $scale),
    (Color "#f1d673"),
    (Color "#d4af37"),
    35
  )
  $ink = New-Object System.Drawing.SolidBrush (Color "#080f14")

  Fill-Path @(
    [System.Drawing.PointF]::new($cx, $cy - 62 * $scale),
    [System.Drawing.PointF]::new($cx + 66 * $scale, $cy + 55 * $scale),
    [System.Drawing.PointF]::new($cx + 34 * $scale, $cy + 55 * $scale),
    [System.Drawing.PointF]::new($cx, $cy - 6 * $scale),
    [System.Drawing.PointF]::new($cx - 34 * $scale, $cy + 55 * $scale),
    [System.Drawing.PointF]::new($cx - 66 * $scale, $cy + 55 * $scale)
  ) $gold

  Fill-Path @(
    [System.Drawing.PointF]::new($cx, $cy - 28 * $scale),
    [System.Drawing.PointF]::new($cx + 43 * $scale, $cy + 55 * $scale),
    [System.Drawing.PointF]::new($cx + 20 * $scale, $cy + 55 * $scale),
    [System.Drawing.PointF]::new($cx, $cy + 16 * $scale),
    [System.Drawing.PointF]::new($cx - 20 * $scale, $cy + 55 * $scale),
    [System.Drawing.PointF]::new($cx - 43 * $scale, $cy + 55 * $scale)
  ) $ink

  Fill-Path @(
    [System.Drawing.PointF]::new($cx - 8 * $scale, $cy + 25 * $scale),
    [System.Drawing.PointF]::new($cx + 8 * $scale, $cy + 25 * $scale),
    [System.Drawing.PointF]::new($cx + 24 * $scale, $cy + 55 * $scale),
    [System.Drawing.PointF]::new($cx + 6 * $scale, $cy + 55 * $scale),
    [System.Drawing.PointF]::new($cx, $cy + 43 * $scale),
    [System.Drawing.PointF]::new($cx - 6 * $scale, $cy + 55 * $scale),
    [System.Drawing.PointF]::new($cx - 24 * $scale, $cy + 55 * $scale)
  ) $gold

  $gold.Dispose()
  $ink.Dispose()
}

function Draw-Ambiten-Mark($cx, $cy, $scale) {
  $rect = [System.Drawing.RectangleF]::new($cx - 26 * $scale, $cy - 26 * $scale, 52 * $scale, 52 * $scale)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, (Color "#00d4ff"), (Color "#7861ff"), 35)
  $pen = New-Object System.Drawing.Pen($brush, 9 * $scale)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddLines([System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new($cx - 22 * $scale, $cy + 20 * $scale),
    [System.Drawing.PointF]::new($cx - 3 * $scale, $cy - 24 * $scale),
    [System.Drawing.PointF]::new($cx + 18 * $scale, $cy + 18 * $scale)
  ))
  $g.DrawPath($pen, $path)
  $g.FillEllipse($brush, $cx + 24 * $scale, $cy + 13 * $scale, 14 * $scale, 14 * $scale)

  $path.Dispose()
  $pen.Dispose()
  $brush.Dispose()
}

function Draw-LetterSpaced($text, $font, $brush, $x, $y, $spacing) {
  $cursor = [float]$x
  foreach ($char in $text.ToCharArray()) {
    $s = [string]$char
    $g.DrawString($s, $font, $brush, $cursor, $y)
    $cursor += $g.MeasureString($s, $font).Width + $spacing
  }
}

$bgRect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, (Color "#050a0e"), (Color "#252b30"), 25)
$g.FillRectangle($bg, $bgRect)
$bg.Dispose()

$goldGlow = New-Object System.Drawing.SolidBrush (Color "#d4af37" 7)
$blueGlow = New-Object System.Drawing.SolidBrush (Color "#3d96ff" 5)
$g.FillEllipse($goldGlow, 750, 54, 330, 235)
$g.FillEllipse($blueGlow, 740, 352, 350, 240)
$goldGlow.Dispose()
$blueGlow.Dispose()

$bedrockBrush = New-Object System.Drawing.SolidBrush (Color "#030608" 150)
Fill-Path @(
  [System.Drawing.PointF]::new(0, 505),
  [System.Drawing.PointF]::new(170, 462),
  [System.Drawing.PointF]::new(330, 492),
  [System.Drawing.PointF]::new(520, 430),
  [System.Drawing.PointF]::new(725, 520),
  [System.Drawing.PointF]::new(900, 462),
  [System.Drawing.PointF]::new(1200, 540),
  [System.Drawing.PointF]::new(1200, 630),
  [System.Drawing.PointF]::new(0, 630)
) $bedrockBrush
$strataPen = New-Object System.Drawing.Pen((Color "#ffffff" 18), 1.4)
$g.DrawLine($strataPen, 24, 538, 325, 522)
$g.DrawLine($strataPen, 410, 552, 720, 542)
$g.DrawLine($strataPen, 776, 562, 1168, 548)
$g.DrawLine($strataPen, 92, 590, 458, 576)
$g.DrawLine($strataPen, 604, 600, 1108, 582)
$strataPen.Dispose()
$bedrockBrush.Dispose()

$white = New-Object System.Drawing.SolidBrush (Color "#ffffff")
$muted = New-Object System.Drawing.SolidBrush (Color "#ffffff" 176)
$goldText = New-Object System.Drawing.SolidBrush (Color "#d4af37")
$linePen = New-Object System.Drawing.Pen((Color "#d4af37" 170), 3)
$linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

$fontBrand = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$fontHeadline = New-Object System.Drawing.Font("Segoe UI", 56, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Regular)
$fontSmall = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$fontTiny = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$fontAbinod = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)

Draw-Keystone 98 88 0.34
Draw-LetterSpaced "ABINOD" $fontBrand $white 138 70 8

$format = New-Object System.Drawing.StringFormat
$format.Trimming = [System.Drawing.StringTrimming]::Word
$g.DrawString("Strong foundations", $fontHeadline, $white, 76, 188)
$g.DrawString("create stronger", $fontHeadline, $white, 76, 270)
$g.DrawString("systems.", $fontHeadline, $white, 76, 352)
$g.DrawString("Abinod builds infrastructure products around", $fontSub, $muted, 80, 462)
$g.DrawString("clarity, reliable execution, and long-term", $fontSub, $muted, 80, 500)
$g.DrawString("maintainability.", $fontSub, $muted, 80, 538)

Draw-Keystone 948 122 0.95
$keyLabel = "Keystone Principle"
$keyLabelSize = $g.MeasureString($keyLabel, $fontSmall)
$g.DrawString($keyLabel, $fontSmall, $muted, 948 - $keyLabelSize.Width / 2, 192)

$g.DrawLine($linePen, 948, 230, 948, 292)
$abinodText = "ABINOD"
$abinodSize = $g.MeasureString($abinodText, $fontAbinod)
$g.DrawString($abinodText, $fontAbinod, $white, 948 - $abinodSize.Width / 2, 304)

$g.DrawLine($linePen, 818, 374, 1078, 374)
$g.DrawLine($linePen, 818, 374, 818, 426)
$g.DrawLine($linePen, 948, 374, 948, 426)
$g.DrawLine($linePen, 1078, 374, 1078, 426)

Draw-Ambiten-Mark 818 458 1
$ambitenSize = $g.MeasureString("Ambiten", $fontTiny)
$g.DrawString("Ambiten", $fontTiny, $muted, 818 - $ambitenSize.Width / 2, 494)

$futureBrush = New-Object System.Drawing.SolidBrush (Color "#ffffff" 18)
$futurePen = New-Object System.Drawing.Pen((Color "#ffffff" 110), 2)
$g.FillEllipse($futureBrush, 928, 440, 40, 40)
$g.DrawEllipse($futurePen, 928, 440, 40, 40)
$g.FillEllipse($futureBrush, 1058, 440, 40, 40)
$g.DrawEllipse($futurePen, 1058, 440, 40, 40)
$futureSize = $g.MeasureString("Future Product", $fontTiny)
$g.DrawString("Future Product", $fontTiny, $muted, 948 - $futureSize.Width / 2, 494)
$g.DrawString("Future Product", $fontTiny, $muted, 1078 - $futureSize.Width / 2, 494)
$futureBrush.Dispose()
$futurePen.Dispose()

$bitmap.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$format.Dispose()
$fontBrand.Dispose()
$fontHeadline.Dispose()
$fontSub.Dispose()
$fontSmall.Dispose()
$fontTiny.Dispose()
$fontAbinod.Dispose()
$linePen.Dispose()
$white.Dispose()
$muted.Dispose()
$goldText.Dispose()
$g.Dispose()
$bitmap.Dispose()

Write-Output $out
